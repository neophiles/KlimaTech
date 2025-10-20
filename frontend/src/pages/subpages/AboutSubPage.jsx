import "./AboutSubPage.css";

function AboutSubPage() {
    return (
        <>
            <div className="base-widget raised-widget settings-widget about what">
                <h3 className="widget-title">What is <span className="highlight bold">PRESKO?</span></h3>
                <hr />
                <h4>The Mission</h4>
                <p>
                    The Philippine heat can be more than just uncomfortable; it can be dangerous.{" "}
                    <span className="highlight bold">PRESKO</span> (from pampapresko, 'to cool down') is your daily companion for navigating the tropical heat safely and comfortably.
                </p>
                <h4>Core Features</h4>
                <ul>
                    <li>
                        <span className="highlight bold">24-Hour Heat Index</span>: Plan your day with our real-time and upcoming heat index forecast, powered by Open-Meteo.
                    </li>
                    <li>
                        <span className="highlight bold">PreskoSpots</span>: Find the nearest public parks, malls, libraries, or palamigan (cooling stations) to get a break from the heat.
                    </li>
                    <li>
                        <span className="highlight bold">Init Tips</span>: Simple, actionable do's and don'ts to keep you and your loved ones safe during extreme heat.
                    </li>
                </ul>
            </div>

            <div className="base-widget raised-widget settings-widget about who">
                <h3 className="widget-title">Meet the Team</h3>
                <hr />
                <p>We are a group of CS students from <a className="university" href="https://mseuf.edu.ph/" target="_blank"><span className="highlight bold">Manuel S. Enverga University Foundation Lucena</span></a> passionate about using technology to promote climate resilience in the Philippines. 🇵🇭</p>
                <div className="team-container">
                    <a className="member" href="https://www.linkedin.com/in/marc-neil-tagle/" target="_blank">
                        <img className="pic" src="./photos/neil.jpg" alt="Neil's Picture" />
                        <h4 className="name">Marc Neil Tagle</h4>
                        <p className="role">Project Lead & Frontend Developer</p>
                    </a>
                    <a className="member" href="https://www.linkedin.com/in/villarm/" target="_blank">
                        <img className="pic" src="./photos/rm.jpg" alt="RM's Picture" />
                        <h4 className="name">Rodmark Bernard Villa</h4>
                        <p className="role">Backend & Systems Developer</p>
                    </a>
                    <a className="member" href="https://www.linkedin.com/in/vincent-aguirre-367173367/" target="_blank">
                        <img className="pic" src="./photos/vincent.png" alt="Vincent's Picture" />
                        <h4 className="name">Paul Vincent Aguirre</h4>
                        <p className="role">UI/UX Designer</p>
                    </a>
                    <a className="member" href="https://www.linkedin.com/in/kydequito/" target="_blank">
                        <img className="pic" src="./photos/kyla.jpg" alt="Kyla's Picture" />
                        <h4 className="name">Kyla Dessirei Dequito</h4>
                        <p className="role">Research & Frontend Contributor</p>
                    </a>
                    <a className="member" href="mailto:iggycamelot@gmail.com" target="_blank">
                        <img className="pic" src="./photos/iggy.jpg" alt="Iggy's Picture" />
                        <h4 className="name">Iggy Michael Cadeliña</h4>
                        <p className="role">Data & Backend Contributor</p>
                    </a>
                </div>
            </div>

            <div className="base-widget raised-widget settings-widget about disclaimer">
                <h3 className="widget-title">Important Disclaimers & Reminders</h3>
                <hr />
                <h4>General Disclaimer</h4>
                <p>
                    <span className="highlight bold">PRESKO</span> is an informational tool, not a medical device. 
                    The information provided (heat index, tips) is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <h4>On Heat Index & Tips</h4>
                <p>
                    Always listen to your body. If you feel symptoms of heat exhaustion (dizziness, nausea, headache), seek a cool place and medical attention immediately. 
                    The <span className="highlight bold">'Init Tips'</span> are general guidelines and may not apply to every individual's health condition.
                </p>
                <h4>On PreskoSpots</h4>
                <p>
                    The <span className="highlight bold">'PreskoSpots'</span> feature relies on publicly available data and CSS (community-sourced suggestions). PRESKO does not guarantee the safety, accessibility, or operating hours of these locations. 
                    Please exercise caution and verify information before traveling.
                </p>
                <h4>Data Source</h4>
                <p>
                    Heat Index data is sourced from Open-Meteo.com. 
                    We are not responsible for inaccuracies from third-party data providers.
                </p>
            </div>

            <div className="base-widget raised-widget settings-widget about technical">
                <h3 className="widget-title">Technical</h3>
                <hr />
                <h4>Send Feedback</h4>
                <p>
                    See a <span className="highlight bold">bug</span>? Have a <span className="highlight bold">suggestion</span>? We'd love to hear it! 
                    Email us at: <a href="mailto:feedback@presko.ph">feedback@presko.ph</a>
                </p>
                <h4>Attribution</h4>
                <ul>
                    <li>Maps powered by <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a></li>
                    <li>Weather data from <a href="https://open-meteo.com/" target="_blank">Open-Meteo</a></li>
                    <li>Icons by <a href="https://heroicons.com/" target="_blank">Heroicons</a> and <a href="https://tabler.io/icons" target="_blank">Tabler</a></li>
                </ul>
                <h4>Version</h4>
                <p>Version 0.0.1 (Build 20251020)</p>
            </div>
        </>
    );
}

export default AboutSubPage;