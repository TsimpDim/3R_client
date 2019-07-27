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

export const succ_res_add = () => {
    message.success("Resource added");
};

export const succ_copy = () => {
    message.success("URL copied to clipboard");
}

export const err_delete = () => {
    message.error("Error deleting resource");
}

export const succ_delete = () => {
    message.warn("Resource deleted successfully");
}

export const succ_recover = () => {
    message.success("Resource recovered successfully");
}

export const err_recover = () => {
    message.error("Couldn't recover resource");
}