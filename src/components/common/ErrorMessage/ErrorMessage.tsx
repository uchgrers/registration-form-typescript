import React from 'react';
import styles from './ErrorMessage.module.scss';

type ErrorMessageType = {
    message: string | null
}

const ErrorMessage: React.FC<ErrorMessageType> = (props) => {
    return (
        <p className={styles.message}>
            {props.message}
        </p>
    );
};

export default ErrorMessage;