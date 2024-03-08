import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./profile.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import Form from './form/form';
import { authSliceActions } from "../../../../store/auth/auth";
import KycModal from "../userKyc/kycmodal"
import KybModal from "../userKyb/kybmodal"

const Profile = () => {

    const [isOpenKyc, setIsOpenKyc] = useState(false);
    console.log('debug isopen kyc', isOpenKyc)
    const [isOpenKyb, setIsOpenKyb] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { dark } = useSelector((state) => state.mode);
    const [refresh, setRefresh] = useState(Date.now());

    return (
        <div className={styles.profile}>
            {((user.decision == null || user.decision == 0) && (user.kyc == 0)) && (
                <button className={styles.primaryBtn} onClick={() => setIsOpenKyc(true)}>
                    Submit KYC
                </button>
            )}
            {(user.kyc == 1) && (
                <button className={styles.primaryBtn} onClick={() => setIsOpenKyb(true)}>
                    Submit KYB
                </button>
            )}
            {(user.decision == 1) && (
                <div style={{ display: "flex" }}>
                    <button className={styles.primaryBtn} onClick={() => setIsOpenKyc(true)}>
                        Resubmit KYC
                    </button>
                    <div className={styles.ReviewBtn} >
                        On Review
                    </div>
                </div>
            )}
            {isOpenKyc && <KycModal setIsOpenKyc={setIsOpenKyc} />}
            {isOpenKyb && <KybModal setIsOpenKyb={setIsOpenKyb} />}
            <h3>Store Profile</h3>
            <Form />
        </div>
    );
}

export default Profile;
