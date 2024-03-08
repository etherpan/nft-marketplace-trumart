import { useDispatch, useSelector } from "react-redux";
import styles from "./form.module.css"
import { notificationActions } from "../../../../../store/notification/notification";
import apiRequest from "../../../../../helpers/connections";
import { authSliceActions } from "../../../../../store/auth/auth";
import { getImageUrl } from "../../../../../helpers/utils";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";

const Form = () => {
    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth.loggedIn);
    const editor = useRef(null);
    const editor1 = useRef(null);
    const editor2 = useRef(null);
    const dispatch = useDispatch()
    const [content, setContent] = useState(user.description);
    const [addtional, setAdditional] = useState(user.additional);
    const [shipping, setShipping] = useState(user.shipping_policy);
    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/doc/,
            height: 400,
            placeholder: "Start typing description...",
        }),
        []
    );

    const handleUpdate = (event) => {
        setContent(event);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const form = new FormData(e.target)

        form.append("description", content)
        form.append("shipping_policy", shipping)
        form.append("additional", addtional)

        try {
            dispatch(notificationActions.setNotify(true));
            const res = await apiRequest("merchant", form, "POST", auth)
            dispatch(authSliceActions.setUser(res.merchant));
            dispatch(notificationActions.setMessage("Update was succesful"))
        } catch (error) {
            if (error?.info?.error?.status === 422) {
                dispatch(notificationActions.setMessage(error?.info?.error?.message));
            } else {
                dispatch(notificationActions.setMessage(error.message));
            }
        }
    }

    const { dark } = useSelector(
        (state) => state.mode
    );

    return (
        <div className={`${styles.profile} ${dark ? styles.dark : ""}`} onSubmit={handleSubmit}>
            <form className={styles.form} >
                <label>
                    Business Name
                    <input type="text" placeholder={user.business_name} name="business_name" />
                </label>
                <label>
                    First Name
                    <input type="text" placeholder={user.first_name} name="first_name" />
                </label>
                <label>
                    Last Name
                    <input type="text" placeholder={user.last_name} name="last_name" />
                </label>
                <label>
                    Business Email
                    <input type="text" placeholder={user.email} name="email" readOnly />
                </label>
                <label>
                    Password
                    <input type="password" placeholder="**********" name="password" />
                </label>
                <label className={styles.editor}>
                    About {user.first_name}
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={newContent => handleUpdate(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                </label>
                <label>
                    Phone Number
                    <input type="tel" placeholder={user.phone} name="phone" />
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
                    Post Code
                    <input type="text" placeholder={user.postal} name="postal" />
                </label>
                <label>
                    Founding year
                    <input type="tel" placeholder={user.year} name="year" />
                </label>
                <button>Save</button>
                <div className={styles.cat}>
                    <h3>Socials</h3>
                </div>
                <label>
                    Website
                    <input type="text" placeholder={user.website} name="website" />
                </label>
                <label>
                    Twitter
                    <input type="text" placeholder={user.twitter} name="twitter" />
                </label>
                <label>
                    Telegram
                    <input type="text" placeholder={user.telegram} name="telegram" />
                </label>
                <label>
                    Discord
                    <input type="text" placeholder={user.discord} name="discord" />
                </label>
                <label>
                    Tiktok
                    <input type="text" placeholder={user.tiktok} name="tiktok" />
                </label>
                <label>
                    Facebook
                    <input type="text" placeholder={user.facebook} name="facebook" />
                </label>
                <button>Save</button>
                <div className={styles.cat}>
                    <h3>More Information</h3>
                </div>
                <label>
                    Upload Avatar
                    <div className={styles.upload}>
                        <img src={getImageUrl("upavatar.png")} alt="upavatar" />
                        <input type="file" name="image" />
                    </div>
                </label>
                <label>
                    Upload Banner
                    <div className={styles.upload}>
                        <img src={getImageUrl("upavatar.png")} alt="upavatar" />
                        <input type="file" name="banner" />
                    </div>
                </label>
                <div>
                    <p>Store Front Images.</p>
                    <label className={styles.nobg}>
                        (Upload multiple images to upload more than one store image)
                        <input type="file" name="gallery" multiple />
                    </label>
                </div>

                <label className={styles.nobg}>
                    Upload business license
                    <input type="file" name="license" />
                </label>
                <label className={styles.editor}>
                    Shipping and Storage
                    <JoditEditor
                        ref={editor1}
                        value={shipping}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={newContent => setShipping(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                </label>
                <label className={styles.editor}>
                    Additional Information
                    <JoditEditor
                        ref={editor2}
                        value={addtional}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={newContent => setAdditional(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                </label>
                <button>Save</button>
            </form>
            <div id="effectiv-mount"></div>
        </div>
    );
}

export default Form;
