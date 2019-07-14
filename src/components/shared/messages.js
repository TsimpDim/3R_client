import { message } from 'antd';


export const ntwrk_err = () => {
    message.error("Network Error");
}

export const succ_register = () => {
    message.success("You are now registered");
}

export const succ_login = () => {
    message.success("Logged in");
};

export const succ_logout = () => {
    message.success("Logged out");
};

export const must_auth = () => {
    message.warning("You must be logged in to access this page");
};