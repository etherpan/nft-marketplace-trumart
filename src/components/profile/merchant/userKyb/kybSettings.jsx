import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../../../helpers/utils";
import styles from "./userprofile.module.css"
import apiRequest from "../../../../helpers/connections";
import { notificationActions } from "../../../../store/notification/notification";
import { authSliceActions } from "../../../../store/auth/auth";

const Userprofile = () => {
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch()
    const { dark } = useSelector(
        (state) => state.mode
    );

    const handleUpdate = async (e) => {
        e.preventDefault()
        dispatch(notificationActions.setNotify(true))
        const form = new FormData(e.target)

        try {
            const res = await apiRequest("user", form, "POST", auth)
            dispatch(authSliceActions.setUser(res.user));
            dispatch(notificationActions.setMessage("Update was succesful"))
        } catch (error) {
            if (error?.info?.error?.status === 422) {
                dispatch(notificationActions.setMessage(error?.info?.error?.message));
            } else {
                dispatch(notificationActions.setMessage("Something went wrong"));
            }
        }

    }


    const startVerification = () => {
        //request to get token


    }

    return (
        <div className={`${styles.profile} ${dark ? styles.dark : ""}`} >
            <h3>KYB Request</h3> 
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
            {!user.kyc ? <div className={styles.form}>
                <button onClick={startVerification}>
                    Start verification
                </button>
            </div> : <></>}
            <div id="effectiv-mount"></div>
        </div>
    );
}

export default Userprofile;
