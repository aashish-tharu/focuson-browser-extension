import ExtenIcon from './../../../assets/ext-icon.png';
import './About.css';

function About() {
    return (
        <div className="about-page">
            <h1 className="page-title">About</h1>

            <div className="main-card">
                <div className="header-section">
                    <img src={ExtenIcon} alt="extension-icon" className="app-icon" />
                    <div className="header-text">
                        <h2 className="app-name">Focus On</h2>
                    </div>
                </div>
            </div>

            <footer className="about-footer">
                <p className="copyright">Focus On Project</p>
                <p className="copyright">Made with ❤️ by Aashish</p>
            </footer>
        </div>
    );
}

export default About;