import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../../../helpers/utils";
import styles from "./kybmodal.module.css"
import apiRequest from "../../../../helpers/connections";
// import { authSliceActions } from "../../../../../store/auth/auth";
import { authSliceActions } from "../../../../store/auth/auth";
import { notificationActions } from "../../../../store/notification/notification";
import { useMemo, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const kybModal = ({ setIsOpenKyb }) => {
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const { dark } = useSelector((state) => state.mode);
    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/doc/,
            height: 400,
            placeholder: "Start typing description...",
        }),
        []
    );

    const handleKybUpdate = async (e) => {
        e.preventDefault()
        dispatch(notificationActions.setNotify(true))
        const form = new FormData(e.target);

        try {
            // Request KYB to effectiv
            const responseKyb = await apiRequest(
                "merchant/kyb",
                {
                    business_name: form.get("business_name"),
                    business_email: form.get("business_email"),
                    business_line1: form.get("business_line1"),
                    business_street: form.get("business_street"),
                    business_city: form.get("business_city"),
                    business_state: form.get("business_state"),
                    business_country: form.get("business_country"),
                    business_postal: form.get("business_postal"),
                    business_ein: form.get("business_ein"),
                    business_website: form.get("business_website"),
                },
                "POST",
                auth
            );

            dispatch(notificationActions.setMessage("KYB request has been successfully submitted."))

            // Approve request for user KYB
            if (responseKyb.data.evaluation_status === "evaluation_completed") {
                try {
                    await apiRequest(
                        "merchant/approvekyb",
                        undefined,
                        "POST",
                        auth
                    );
                    dispatch(notificationActions.setMessage("KYB request has been successfully approved."))
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            if (error?.info?.error?.status === 422) {
                dispatch(notificationActions.setMessage(error?.info?.error?.message));
            } else if (error.response && error.response.status === 401) {
                // Handle the 401 Unauthorized error here, such as showing a message to the user
                dispatch(notificationActions.setError("Unauthorized access. Please log in."));
            }
            else {
                dispatch(notificationActions.setMessage("Something went wrong"));
            }
        }
        setIsOpenKyb(false);
    }

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpenKyb(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>Information for KYB (merchant)</h5>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpenKyb(false)}>
                        <RiCloseLine style={{ marginBottom: "-3px" }} />
                    </button>
                    <form onSubmit={handleKybUpdate} className={styles.form}>
                        <div className={styles.cat}>
                            <h3>Information for KYB</h3>
                        </div>
                        <label>
                            Business Name
                            <input type="text" placeholder={user.business_name} name="business_name" required />
                        </label>
                        <label>
                            Business Email
                            <input type="text" placeholder={user.business_email} name="business_email" required />
                        </label>
                        <label>
                            Business Address
                        </label>
                        <label>
                            Line 1
                            <input type="text" placeholder={user.business_line1} name="business_line1" required />
                        </label>
                        <label>
                            Street
                            <input type="text" placeholder={user.business_street} name="business_street" required />
                        </label>
                        <label>
                            City
                            <input type="text" placeholder={user.business_city} name="business_city" required />
                        </label>
                        <label>
                            State
                            <input type="text" placeholder={user.business_state} name="business_state" required />
                        </label>
                        <label>
                            Postal
                            <input type="number" placeholder={user.business_postal} name="business_postal" required />
                        </label>
                        <label>
                            TIN/EIN
                            <input type="text" placeholder={user.business_email} name="business_ein" required />
                        </label>
                        <label>
                            Website
                            <input type="text" placeholder={user.business_website} name="business_website" required />
                        </label>
                        <div className={styles.modalContent}>
                            Are you sure you want to submit your KYB information?
                        </div>
                        <div className={styles.modalActions}>
                            <div className={styles.actionsContainer}>
                                <button>Submit</button>
                                <button className={styles.cancelBtn} onClick={() => setIsOpenKyb(false)} >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default kybModal;
