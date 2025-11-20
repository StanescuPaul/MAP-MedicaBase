import { useState } from "react";
import { Link } from "react-router";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import styles from "./Register.module.css";

export function Register() {
  return (
    <div className={styles.container}>
      <KInput type="text" placeholder="name" />
      <KInput type="text" placeholder="User name" />
      <KInput type="password" placeholder="Password" />
      <KButton name="Sign in" />
    </div>
  );
}
