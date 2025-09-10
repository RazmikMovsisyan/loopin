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
    const { data } = await axiosReq.put(`/drafts/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    console.error("Error updating draft:", err);
    throw err;
  }
};

export const deleteDraft = async (id) => {
  try {
    await axiosReq.delete(`/drafts/${id}/`);
  } catch (err) {
    console.error("Error deleting draft:", err);
    throw err;
  }
};

export const publishDraft = async (id) => {
  try {
    const { data } = await axiosReq.patch(`/drafts/${id}/publish/`);
    return data;
  } catch (err) {
    console.error("Error publishing draft:", err);
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  }
};