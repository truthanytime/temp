import React, { useState } from "react";
// import Geocode from '../utils/geocode';
import { Link } from "react-router-dom";

const LocationView = ({ id, address, phonemodel }) => {
  return (
    <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
      <p className="me-0 m-0">
        <i className="text-grey-500 feather-smartphone me-1"></i> {phonemodel}
      </p>
      <Link to={`/mapping/${id}`} style={{ color: 'inherit' }}>
        <i className="text-grey-500 feather-map-pin me-1"></i> {address}
      </Link>
    </span>
  );
};

export default LocationView;
