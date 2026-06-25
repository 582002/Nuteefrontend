import React, { useState } from "react";
import "./AdditionalInfo.css";
// import user1 from "../../../Assets/Users/user1.jpeg"; // REMOVED
// import user2 from "../../../Assets/Users/user2.jpeg"; // REMOVED
import { FaStar } from "react-icons/fa";
import Rating from "@mui/material/Rating";

const AdditionalInfo = ({ product }) => {
  const [activeTab, setActiveTab] = useState("aiTab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="productAdditionalInfo">
        <div className="productAdditonalInfoContainer">
          <div className="productAdditionalInfoTabs">
            <div className="aiTabs">
              <p
                onClick={() => handleTabClick("aiTab1")}
                className={activeTab === "aiTab1" ? "aiActive" : ""}
              >
                Description
              </p>
              <p
                onClick={() => handleTabClick("aiTab2")}
                className={activeTab === "aiTab2" ? "aiActive" : ""}
              >
                Additional Information
              </p>
              <p
                onClick={() => handleTabClick("aiTab3")}
                className={activeTab === "aiTab3" ? "aiActive" : ""}
              >
                Reviews {/* CHANGED: Removed static count */}
              </p>
            </div>
          </div>
          <div className="productAdditionalInfoContent">
            {/* Tab1 - Description */}
            {activeTab === "aiTab1" && (
              <div className="aiTabDescription">
                <div className="descriptionPara">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                </div>
                <div className="descriptionPara">
                  <h3>Care Instructions</h3>
                  <p>{product.careInstructions}</p>
                </div>
              </div>
            )}

            {/* Tab2 - Additional Information */}
            {activeTab === "aiTab2" && (
              <div className="aiTabAdditionalInfo">
                <div className="additionalInfoContainer">
                  <h6>Model</h6>
                  <p>{product.model}</p>
                </div>
                <div className="additionalInfoContainer">
                  <h6>Color</h6>
                  <p>{product.color}</p>
                </div>
                <div className="additionalInfoContainer">
                  <h6>Size</h6>
                  <p>{product.size}</p>
                </div>
                <div className="additionalInfoContainer">
                  <h6>Fabric Type</h6>
                  <p>{product.fabricType}</p>
                </div>
                <div className="additionalInfoContainer">
                  <h6>Material</h6>
                  <p>{product.materialComposition}</p>
                </div>
              </div>
            )}

            {/* Tab3 - Reviews */}
            {activeTab === "aiTab3" && (
              <div className="aiTabReview">
                <div className="aiTabReviewContainer">
                  <h3>Customer Reviews</h3>
                  {/* CHANGED: Show average rating, removed static reviews */}
                  <div className="flex items-center gap-2 mb-6">
                    <h4 className="text-xl font-semibold">{product.productReviews}</h4>
                    <FaStar color="#FEC78A" size={20} />
                    <span className="text-gray-600">Average Rating</span>
                  </div>

                  {/* Your "Add a Review" form */}
                  <div className="userNewReview">
                    <div className="userNewReviewMessage">
                      <h5>
                        Be the first to review “{product.productName}”
                      </h5>
                      <p>
                        Your email address will not be published. Required
                        fields are marked *
                      </p>
                    </div>
                    <div className="userNewReviewRating">
                      <label>Your rating *</label>
                      <Rating name="simple-controlled" size="small" />
                    </div>
                    <div className="userNewReviewForm">
                      {/* This form needs an onSubmit handler to POST to a new API endpoint */}
                      <form>
                        <textarea
                          cols={30}
                          rows={8}
                          placeholder="Your Review"
                        />
                        <input
                          type="text"
                          placeholder="Name *"
                          required
                          className="userNewReviewFormInput"
                        />
                        <input
                          type="email"
                          placeholder="Email address *"
                          required
                          className="userNewReviewFormInput"
                        />
                        <div className="userNewReviewFormCheck">
                          <label>
                            <input type="checkbox" placeholder="Subject" />
                            Save my name, email, and website in this browser for
                            the next time I comment.
                          </label>
                        </div>
                        <button type="submit">Submit</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdditionalInfo;