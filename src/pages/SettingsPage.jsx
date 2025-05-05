import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import LanguageSetting from './LanguageSetting';
import NotificationSetting from './NotificationSetting';
import PrivacySetting from './PrivacySetting';
import FeedbackPage from './FeedbackPage';
import AboutPage from './AboutPage';

export default function SettingsPage({ language, toggleLanguage }) {

    const isTH = language === 'th';

    const labels = {
        account: isTH ? 'บัญชีผู้ใช้' : 'Account',
        language: isTH ? 'ภาษา' : 'Language',
        notification: isTH ? 'การแจ้งเตือน' : 'Notification',
        privacy: isTH ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy',
        feedback: isTH ? 'ส่งคําแนะนํา' : 'Give Feedback',
        about: isTH ? 'เกี่ยวกับ' : 'About',
    };

    return (
        <Routes>
            <Route
                index
                element={
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">⚙️ Settings</h2>
                        <ul className="space-y-2">
                            <li><Link to="login">👤 {labels.account}</Link></li>
                            <li><Link to="language">🌐 {labels.language}</Link></li>
                            <li><Link to="notification">🔔 {labels.notification}</Link></li>
                            <li><Link to="privacy">🔑 {labels.privacy}</Link></li>
                            <li><Link to="feedback">💬 {labels.feedback}</Link></li>
                            <li><Link to="about">❓ {labels.about}</Link></li>
                        </ul>
                    </div>
                }
            />
                
            {/* Account Subroutes */}
            <Route path="Login" element={<Login />} />
            <Route path="register" element={<Register />} />
        
            {/* Settings Subroutes */}
            <Route path="language" element={<LanguageSetting language={language} toggleLanguage={toggleLanguage} />} />
            <Route path="notification" element={<NotificationSetting />} />
            <Route path="privacy" element={<PrivacySetting />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="about" element={<AboutPage />} />
            
            <Route path="*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
    );
}
