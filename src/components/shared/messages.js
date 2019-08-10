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

export const err_get_res = () => {
    message.error("Couldn't grab resource details");
}

export const err_make_invis = () => {
    message.error("Couldn't delete resource");
}

export const inf_set_sort = () => {
    message.info("Setting sorting preference");
}

export const succ_set_sort = () => {
    message.success("Sorting preference set");
}

export const err_set_sort = () => {
    message.error("Couldn't set sorting preference");
}

export const err_get_options = () => {
    message.error("Could not process user options.");
}