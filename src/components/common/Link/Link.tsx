import React from 'react';
import {NavLink} from "react-router-dom";

type LocationType = '/login' | '/register'

type LinkType = {
    action: string,
    location: LocationType
}

const Link: React.FC<LinkType> = (props) => {
    return (
        <div>
            {props.action} <NavLink to={props.location}>here</NavLink>
        </div>
    );
};

export default Link;