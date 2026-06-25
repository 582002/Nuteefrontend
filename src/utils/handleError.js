// simple error formatter used by many components
export function handleError(err) {
  try {
    if (!err) return "Unknown error";
    // axios error
    if (err.response && err.response.data) {
      // server message
      if (typeof err.response.data === "string") return err.response.data;
      if (err.response.data.message) return err.response.data.message;
      if (err.response.data.error) return err.response.data.error;
      return JSON.stringify(err.response.data);
    }
    if (err.message) return err.message;
    return String(err);
  } catch (e) {
    return "An error occurred";
  }
}
export default handleError;
