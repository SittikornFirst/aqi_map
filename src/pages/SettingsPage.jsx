import { Routes, Route, Link } from 'react-router-dom';
import LanguageSetting from './LanguageSetting';
import NotificationSetting from './NotificationSetting';
import PrivacySetting from './PrivacySetting';
import FeedbackPage from './FeedbackPage';
import AboutPage from './AboutPage';

export default function SettingsPage({ language, toggleLanguage }) {
    return (
        <Routes>
            <Route
                index
                element={
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Settings</h2>
                        <ul className="space-y-2">
                            <li><Link to="language">Language</Link></li>
                            <li><Link to="notification"> Notifications</Link></li>
                            <li><Link to="privacy">Privacy Policy</Link></li>
                            <li><Link to="feedback">Give Feedback</Link></li> 
                            <li><Link to="about">About</Link></li> 
                        </ul>
                    </div>
                }
            />
            <Route path="language" element={<LanguageSetting language={language} toggleLanguage={toggleLanguage} />} />
            <Route path="notification" element={<NotificationSetting />} />
            <Route path="privacy" element={<PrivacySetting />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="about" element={<AboutPage />} />
        </Routes>
    );
}
