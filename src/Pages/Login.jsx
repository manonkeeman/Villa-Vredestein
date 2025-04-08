import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

        e.preventDefault();
    };

    return (
            <input
                type="email"
                required
            />
            <input
                type="password"
                required
            />
        </form>
    );
};

export default Login;