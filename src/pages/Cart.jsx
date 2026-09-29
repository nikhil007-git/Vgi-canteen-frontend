import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    openCart();
    navigate("/menu", { replace: true });
  }, [openCart, navigate]);

  return null;
};
