import { Link, useLocation } from "@remix-run/react";



export default function BreadCrumbProvider() {
    const location = useLocation();

    const li = location.pathname.split('/').map((item, index) => {
        if (item === '') {
            return;
        }
        if (index === location.pathname.split('/').length - 1) {
            return <li key={index}>{item}</li>;
        }
        return <li key={index}>
            <Link to={location.pathname.split('/').slice(0, index + 1).join('/')}>{item}</Link>
        </li>;
    });

    return (
        <div className="breadcrumbs text-sm pl-4">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {li}
            </ul>
        </div>
    );
}