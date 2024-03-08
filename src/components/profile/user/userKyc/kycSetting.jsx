import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../../../helpers/utils";
import styles from "./kycsettings.module.css"
import apiRequest from "../../../../helpers/connections";
import { notificationActions } from "../../../../store/notification/notification";
import { authSliceActions } from "../../../../store/auth/auth";

const kycSettings = () => {
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch()
    const { dark } = useSelector(
        (state) => state.mode
    );

    const handleKycUpdate = async (e) => {
        e.preventDefault()
        dispatch(notificationActions.setNotify(true))
        const form = new FormData(e.target);

        try {
            console.log('debug apiRequest1111')
            const res = await apiRequest("user/kyc", { full_name: form.get("full_name"), ssn: form.get("ssn"), birthday: form.get("birthday"), line1: form.get("line1"), street: form.get("street"), city: form.get("city"), state: form.get("state"), postal: form.get("postal"), phone_number: form.get("phone_number") }, "POST", auth);

            dispatch(notificationActions.setMessage("KYC request has been successfully submitted."))

            // Update user's KYC info
            if (res.data.evaluation_status === "evaluation_completed") {
                try {
                    const res = await apiRequest(
                        "user/updatekyc",
                        undefined,
                        "POST",
                        auth
                    );
                    dispatch(notificationActions.setMessage("KYC request has been successfully approved."))
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

    }

    return (
        <div className={`${styles.kyc} ${dark ? styles.dark : ""}`} >
            <h3>Information for KYC</h3>
            <form onSubmit={handleKycUpdate} className={styles.form}>
                <label>
                    Full Name
                    <input type="text" placeholder={user.first_name + " " + user.last_name} name="full_name" />
                </label>
                <label>
                    SSN
                    <input type="number" placeholder="XXXXX5555" name="ssn" />
                </label>
                <label>
                    Date of Birth
                    <input type="text" placeholder="01-01-1970" name="birthday" />
                </label>
                <label>
                    Full Address
                </label>
                <label>
                    Line 1
                    <input type="text" placeholder={user.line1} name="line1" />
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
                    Postal
                    <input type="number" placeholder={user.postal} name="postal" />
                </label>
                <label>
                    Phone Number
                    <input type="number" placeholder={user.phone_number} name="phone_number" />
                </label>
                {/* <label>
                    Country
                    <input type="text" placeholder={user.country} name="country" />
                </label> */}
                <button>Confirm</button>
            </form>
            <div id="effectiv-mount"></div>
        </div>
    );
}

export default kycSettings;
