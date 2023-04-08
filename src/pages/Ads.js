import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { ADS, AUTH, STRIPE, USERS } from "../config/api.config";

import Header from "../components/header";
import Error from "../components/states/Error";
import Success from "../components/states/Success";
import Loading from "../components/states/Loading";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Ad from "../components/advertisements/Ad";
import SelectPost from "../components/advertisements/SelectPost";
import AdInfo from "../components/advertisements/AdInfo";
import CheckoutForm from "../components/advertisements/CheckoutForm";
import { useSearchParams } from "react-router-dom";

const stripePromise = loadStripe(STRIPE, { locale: "en" });

function Explore() {
  const cookies = new Cookies();
  const [searchParams, setSearchParams] = useSearchParams();

  const [user, setUser] = useState();
  const [popup, setPopup] = useState();

  // const [search, setSearch] = useState()
  const [ads, setAds] = useState();
  const [endedAds, setEndedAds] = useState();
  const [page, setPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState("");

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState();

  function getCookie() {
    if (cookies.get("user")) {
      return cookies.get("user");
    }
  }

  function getAds() {
    const user = getCookie();

    axios
      .get(ADS, {
        headers: {
          "x-access-token": user,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setAds(response.data.data.active);
          setEndedAds(response.data.data.ended)
        } else {
          setError(response.data.message);
        }
      });
  }

  function startAdProgress() {
    setPage(1);
  }

  // function handleEnterSearch(e){
  //   if (e.code === "Enter") {
  //     console.log(search);
  //   }
  // }

  useEffect(() => {
    function isAuthenticated() {
      const user = getCookie();

      if (user) {
        axios
          .get(AUTH, {
            headers: {
              "x-access-token": user,
            },
          })
          .then((response) => {
            if (response.data.success) {
              setUser(response.data.user_id);

              getAds();
            } else {
              setUser("none");
              setPopup("login");
              cookies.remove("user", { path: "/" });
            }
          });
      } else {
        setUser("none");
        setPopup("login");
      }
    }

    isAuthenticated();
  }, []);

  useEffect(() => {
    if (selectedPost !== 0 || searchParams.get("post_id")) {
      setPage(2);
      setSearchParams({})
    }
  }, [selectedPost, searchParams.get("post_id")]);

  const options = {
    clientSecret: paymentIntent,
    appearance: {},
  };

  return (
    <div>
      <Header />

      {/* States */}
      {error && <Error message={error} changeMessage={setError} />}
      {success && <Success message={success} changeMessage={setSuccess} />}
      {loading && <Loading changeMessage={setLoading} />}

      {/* <CreateAd></CreateAd>
        <div className="">
          <SearchBar></SearchBar>
          <SearchButton></SearchButton>
        </div>
        <Advertisements></Advertisements> */}

      <div className="container mx-auto">
        <button onClick={startAdProgress} className="text-white bg-blue-500 w-full rounded-xl py-1 mt-6">
          Create new advertisement
        </button>

        {ads && ads.length > 0 &&
          <div className="">
            <div className="my-5">
              <p className="font-bold text-2xl mb-4">Active advertisements</p>
              <div className="grid grid-cols-3 gap-4">
                {ads && ads.map((ad, key) => {
                  return <Ad key={key} post_id={ad.post_id} image={ad.media_link} views={ad.views} budget={ad.budget} status={ad.status} />
                })}
              </div>
            </div>
          </div>
        }

        {endedAds && endedAds.length > 0 &&
          <div className="mb-5 pt-8">
            <p className="font-bold text-2xl mb-4">Ended advertisements</p>
            <div className="grid grid-cols-3 gap-4">
              {endedAds && endedAds.map((ad, key) => {
                return <Ad key={key} post_id={ad.post_id} image={ad.media_link} views={ad.views} budget={ad.budget} status={ad.status} />
              })}
            </div>
          </div>
        }

        {ads && ads.length === 0 &&
          <div className="">
            <div className="my-5">
              <p className="font-bold text-2xl mb-4">Active advertisements</p>
              <p className="">You have no active advertisements</p>
            </div>
          </div>
        }

        {endedAds && endedAds.length === 0 &&
          <div className="mb-5 pt-8">
            <p className="font-bold text-2xl mb-4">Ended advertisements</p>            
            <p className="">You have no ended advertisements</p>
          </div>
        }
      </div>

      {page === 1 && (
        <SelectPost changePage={setPage} changeSelectedPost={setSelectedPost} />
      )}

      {page === 2 && (
        <AdInfo
          changePage={setPage}
          changePaymentIntent={setPaymentIntent}
          selectedPost={selectedPost}
        />
      )}

      {page === 3 && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            changePage={setPage}
            paymentIntent={paymentIntent}
            selectedPost={selectedPost}
          />
        </Elements>
      )}

      {/* Login & register popups */}
      {popup === "login" && (
        <Login
          setPopup={setPopup}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
        />
      )}

      {popup === "register" && (
        <Register
          setPopup={setPopup}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

export default Explore;
