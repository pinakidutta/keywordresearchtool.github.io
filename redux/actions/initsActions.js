import * as t from "../types/initsTypes";


export const setUserVerified = (verified) => {

    return {
        type: t.SET_USER_VERIFIED,
        payload: verified
    }
}

export const setEmailVerification = (verified) => {

    return {
        type: t.SET_EMAIL_VERIFICATION,
        payload: verified
    }
}

export const setSidebarOpen = (open) => {

    return {
        type: t.SET_SIDEBAR_OPEN,
        payload: open
    }
}

export const setToast = (toast) => {

    return {
        type: t.SET_TOAST,
        payload: toast
    }
}

export const setToastTitle = (title) => {

    return {
        type: t.SET_TOAST_TITLE,
        payload: title
    }
}

export const setToastMessage = (message) => {
    
        return {
            type: t.SET_TOAST_MESSAGE,
            payload: message
        }
    }

export const setToastType = (type) => {
    
        return {
            type: t.SET_TOAST_TYPE,
            payload: type
        }
    }

export const setNotificationsOpen = (open) => {
    
        return {
            type: t.SET_NOTIFICATIONS_OPEN,
            payload: open
        }
    }
    
export const setNotifications = (notifications) => {
        
            return {
                type: t.SET_NOTIFICATIONS,
                payload: notifications
            }
        }

export const setSubscriptions = (subscriptions) => {
        
            return {
                type: t.SET_SUBSCRIPTIONS,
                payload: subscriptions
            }
        }
