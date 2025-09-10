import { axiosReq } from "../api/axiosDefaults";

export const fetchDrafts = async (signal) => {
    try {
      const { data } = await axiosReq.get("/drafts/", { signal });
      return data;
    } catch (err) {
      console.error("Error fetching drafts:", err);
      throw err;
    }
  };
  
  export const createDraft = async (formData) => {
    try {
      const { data } = await axiosReq.post("/drafts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (err) {
      console.error("Error creating draft:", err);
      throw err;
    }
  };

export const updateDraft = async (id, formData) => {
  try {
    const { data } = await axiosReq.put(`/drafts/${id}/`, formData);
    return data;
  } catch (err) {
    // Error handling
  }
};

export const deleteDraft = async (id) => {
  try {
    await axiosReq.delete(`/drafts/${id}/`);
  } catch (err) {
    // Error handling
  }
};

export const publishDraft = async (id) => {
  try {
    const { data } = await axiosReq.patch(`/drafts/${id}/publish/`);
    return data;
  } catch (err) {
    // Error handling
  }
};

