import React from "react";
import styles from "../../../styles";
import chevronDown from "../../../assets/chevron-down.svg";

export default function DepositAmount2(props) {
    return (
        <div className={`${styles.amountContainerPool}`}>
            <input
                placeholder="0.0"
                type="number"
                value={props.amount2}
                onChange={props.onAmountChange}
                className={`${styles.amountInputPool}`}
            />
        </div>
    );
}
