import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../../../helpers/utils";
import styles from "./kycmodal.module.css"
import apiRequest from "../../../../helpers/connections";
// import { authSliceActions } from "../../../../../store/auth/auth";
import { authSliceActions } from "../../../../store/auth/auth";
import { notificationActions } from "../../../../store/notification/notification";
import { useMemo, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const kycModal = ({ setIsOpenKyc }) => {
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const { dark } = useSelector((state) => state.mode);
    const [ssnError, setSsnError] = useState(false);

    const handleKycUpdate = async (e) => {
        e.preventDefault()
        dispatch(notificationActions.setNotify(true))
        const form = new FormData(e.target);

        const dobdata = form.get("birthday");
        const date = new Date(dobdata)
        const yearBirth = date.getFullYear(); // Get the current year
        const monthBirth = String(date.getMonth() + 1).padStart(2, '0'); // Get the current month (adding 1 because month is zero-based) and pad with leading zero if necessary
        const dayBirth = String(date.getDate()).padStart(2, '0'); // Get the current day and pad with leading zero if necessary
        const formattedDateBirth = `${yearBirth}-${monthBirth}-${dayBirth}`; // Combine year, mon
        console.log('formattedDate', formattedDateBirth)

        // currenct date
        const currentDate = new Date();
        // Get the individual components of the date
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // Format the date string as desired
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
        const formattedTodayDate = formattedDate.toString();

        // SSN validation
        const ssndata = form.get("ssn");
        if (ssndata.length != 4) {
            setSsnError(true)
            dispatch(notificationActions.setMessage("SSN: Input the latest 4 digit number"))
            return;
        }

        // Get ID
        function generateRandomString(length) {
            let result = '';
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        function generateFormattedRandomResult() {
            const randomString = generateRandomString(32); // Generate a random string of 32 characters
            const formattedResult = `${randomString.substr(0, 8)}-${randomString.substr(8, 4)}-${randomString.substr(12, 4)}-${randomString.substr(16, 4)}-${randomString.substr(20)}`;
            return formattedResult;
        }

        const randomResult = generateFormattedRandomResult();

        try {
            // Request KYC to effectiv for merchant
            const responseKyc = await apiRequest("merchant/kyc", { first_name: form.get("first_name"), last_name: form.get("last_name"), ssn: form.get("ssn"), phone_number: form.get("phone_number"), email: user.email, street: form.get("street"), city: form.get("city"), state: form.get("state"), postal: form.get("postal"), country: form.get("country"), birthday: formattedDateBirth, id: randomResult, timestamp: formattedTodayDate }, "POST", auth);
            
            dispatch(notificationActions.setMessage("KYC request has been successfully submitted."))

            const res1 = await apiRequest("merchant/get", { isKYC: 0 }, "GET", auth);
            console.log('debug rest1111', res1)
            dispatch(authSliceActions.setUser(res1.items[0]));

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
        setIsOpenKyc(false);
    }

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpenKyc(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>Information for KYC (merchant)</h5>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpenKyc(false)}>
                        <RiCloseLine style={{ marginBottom: "-3px" }} />
                    </button>
                    <form onSubmit={handleKycUpdate} className={styles.form}>
                        <div className={styles.cat}>
                            <h3>Information for KYC</h3>
                        </div>
                        <label>
                            First name
                            <input type="text" placeholder={user.first_name} name="first_name" required />
                        </label>
                        <label>
                            Last Name
                            <input type="text" placeholder={user.last_name} name="last_name" required />
                        </label>
                        <label>
                            SSN
                            <input type="number" placeholder="XXXXX5555" name="ssn" required className={ssnError && `input-error`} />
                        </label>
                        <label>
                            Phone Number
                            <input type="number" placeholder={user.phone_number} name="phone_number" required />
                        </label>
                        <label>
                            Full Address
                        </label>
                        <label>
                            Street
                            <input type="text" placeholder={user.street} name="street" required />
                        </label>
                        <label>
                            City
                            <input type="text" placeholder={user.city} name="city" required />
                        </label>
                        <label>
                            State
                            <input type="text" placeholder={user.state} name="state" required />
                        </label>
                        <label>
                            Postal
                            <input type="number" placeholder={user.postal} name="postal" required />
                        </label>
                        <label>
                            Country
                            <input type="text" placeholder={user.country} name="country" />
                        </label>
                        <label>
                            Date of Birth
                            <input type="date" placeholder="yyyy-mm-dd" name="birthday" required />
                        </label>
                        <div className={styles.modalContent}>
                            Are you sure you want to submit your KYC information?
                        </div>
                        <div className={styles.modalActions}>
                            <div className={styles.actionsContainer}>
                                <button>Submit</button>
                                <button className={styles.cancelBtn} onClick={() => setIsOpenKyc(false)} >
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

export default kycModal;
