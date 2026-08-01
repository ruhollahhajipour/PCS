import axios from "axios";


const api = axios.create({

  baseURL:
    "http://localhost:5201/api",

  headers: {

    "Content-Type":
      "application/json",

  },

});





api.interceptors.request.use(

  (config) => {


    console.log(

      "REQUEST:",

      config.method?.toUpperCase(),

      config.url

    );


    return config;


  },


  (error) => {

    return Promise.reject(error);

  }

);







api.interceptors.response.use(


  (response) => {


    console.log(

      "RESPONSE:",

      response.status,

      response.config.url

    );


    return response;


  },



  (error) => {


    console.error(

      "API ERROR"

    );



    if (error.response) {


      console.error(

        "STATUS:",

        error.response.status

      );


      console.error(

        "DATA:",

        error.response.data

      );


    }
    else if (error.request) {


      console.error(

        "NO RESPONSE FROM SERVER"

      );


    }
    else {


      console.error(

        "ERROR:",

        error.message

      );


    }



    return Promise.reject(error);


  }

);




export default api;