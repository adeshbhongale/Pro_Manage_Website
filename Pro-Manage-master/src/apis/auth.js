import axios from "axios";

const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/auth/register`,
      { ...formData }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const loginUser = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/auth/login`,
      {
        ...formData,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const getEmails = async (enteredEmail) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/auth/filter/${enteredEmail || "*"}`,
      {
        headers: {
          "X-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const getDetails = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/auth/details`,
      {
        headers: {
          "X-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const updateDetails = async (updatedDetails) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_APP_BACKEND}/auth/change`,
      {
        updatedDetails,
      },
      {
        headers: {
          "X-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
export { loginUser, registerUser, getEmails, getDetails, updateDetails };
