import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../../../helpers/utils";
import styles from "./userprofile.module.css";
import apiRequest from "../../../../helpers/connections";
import { notificationActions } from "../../../../store/notification/notification";
import { authSliceActions } from "../../../../store/auth/auth";
import KycModal from "../modal/kycmodal"
import { flexbox } from "@mui/system";

const Userprofile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const { dark } = useSelector((state) => state.mode);
    const [refresh, setRefresh] = useState(Date.now());

    useEffect(() => {
        const fetchUser = async () => {
            const res = await apiRequest("user/get", { isKYC: 0 }, "GET", auth);
            dispatch(authSliceActions.setUser(res.items[0]));
        }
        fetchUser();
    }, [])

    const handleUpdate = async (e) => {
        e.preventDefault();
        dispatch(notificationActions.setNotify(true));
        const form = new FormData(e.target);

        try {
            const res = await apiRequest("user", form, "POST", auth);
            dispatch(authSliceActions.setUser(res.user));
            dispatch(notificationActions.setMessage("Update was successful"));
            setIsOpen(false);
        } catch (error) {
            if (error?.info?.error?.status === 422) {
                dispatch(notificationActions.setMessage(error?.info?.error?.message));
            } else {
                dispatch(notificationActions.setMessage("Something went wrong"));
            }
        }
        setRefresh(Date.now());
    };

    return (
        <div className={`${styles.profile} ${dark ? styles.dark : ""}`}>
            {(user.decision == null || user.decision == 0) && (
                <button className={styles.primaryBtn} onClick={() => setIsOpen(true)}>
                    Submit KYC
                </button>
            )}
            {user.decision == 1 && (
                <div style={{display: "flex"}}>
                    <button className={styles.primaryBtn} onClick={() => setIsOpen(true)}>
                        Resubmit KYC
                    </button>
                    <div className={styles.ReviewBtn} >
                     On Review
                    </div>
                </div>
            )}
            {isOpen && <KycModal setIsOpen={setIsOpen} />}
            <h3>Edit Profile</h3>
            <form onSubmit={handleUpdate} className={styles.form}>
                <label>
                    First name
                    <input type="text" placeholder={user.first_name} name="first_name" />
                </label>
                <label>
                    Last name
                    <input type="text" placeholder={user.last_name} name="last_name" />
                </label>
                <label>
                    Email
                    <input type="email" value={user.email} readOnly />
                </label>
                <label>
                    Password
                    <input type="password" placeholder="**********" />
                </label>
                <label>
                    Street
                    <input type="text" placeholder={user.street} name="street" />
                </label>
                <label>
                    City
                    <input type="text" placeholder={user.city} name="city" />
                </label>
                <label>
                    State
                    <input type="text" placeholder={user.state} name="state" />
                </label>
                <label>
                    Country
                    <input type="text" placeholder={user.country} name="country" />
                </label>
                <label>
                    Postal
                    <input type="number" placeholder={user.postal} name="postal" />
                </label>
                <label>
                    Upload Avatar
                    <div className={styles.upload}>
                        <img src={getImageUrl("upavatar.png")} alt="upavatar" />
                        <input type="file" name="image" />
                    </div>
                </label>
                <button>Save</button>
            </form>
        </div>
    );
};

export default Userprofile;
