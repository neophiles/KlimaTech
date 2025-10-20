import { useState } from "react";
import "./InfoSubPage.css";

function InfoSubPage() {
    // track which accordion is open
    const [isOpen, setIsOpen] = useState({
        stroke: false,
        exhaustion: false,
        cramps: false,
        children: false,
        elderly: false,
        outdoor: false,
        ill: false,
        pregnant: false,
        unprivileged: false
    });

    const toggleAccordion = (name) => {
        setIsOpen((prev) => {
            // if the clicked one is already open, close all
            if (prev[name]) {
                return Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {});
            }

            // otherwise, open only the clicked one
            return Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: key === name }), {});
        });
    };

    return (
        <>  
            {/* HEAT DATA IN PH */}
            <div className="base-widget raised-widget settings-widget heat-info">
                <h3 className="widget-title">Datos ng Init sa Pilipinas</h3>
                <div className="heat-data-grid">
                    <div className="heat-data">
                        <span className="data">55°C</span>
                        <span className="desc-1">Extreme Danger</span>
                        <span className="desc-2">Pinakamataas na heat index sa PH (Iba, Zambales – Apr 2024)</span>
                    </div>
                    <div className="heat-data">
                        <span className="data">Daan-daan</span>
                        <span className="desc-1">Cases Every Year</span>
                        <span className="desc-2">Maraming Pilipino ang naaapektuhan ng heat-related illnesses.</span>
                    </div>
                    <div className="heat-data">
                        <span className="data">+1.0°C</span>
                        <span className="desc-1">Pag-init ng Klima</span>
                        <span className="desc-2">Pagtaas ng temperatura na nagdudulot ng mas madalas na extreme heat.</span>
                    </div>
                    <div className="heat-data">
                        <span className="data">March-May</span>
                        <span className="desc-1">Peak Heat Season</span>
                        <span className="desc-2">Pinakamainit na buwan; iwasan ang direktang sikat ng araw.</span>
                    </div>
                </div>
            </div>

            {/* HEAT-RELATED ILLNESSES */}
            <div className="base-widget raised-widget settings-widget illnesses">
                <h3 className="widget-title">Mga Sakit Dahil sa Init</h3>

                {/* STROKE */}
                <div className={`accordion stroke ${isOpen.stroke ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("stroke")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                            <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                            <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                            <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                            <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                            <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Heat Stroke</h4>
                            <span className="danger">EMERGENCY</span>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />
                        <p className="description">
                            Banta sa buhay. Kailangan ng agarang atensyong medikal.
                        </p>

                        <p className="symptoms label">Senyales:</p>
                        <ul className="symptoms">
                            <li>Nalilito, iritable, o nahihirapang magsalita</li>
                            <li>Nawalan ng malay (nahimatay)</li>
                            <li>Mataas na temperatura (40°C o mas mataas)</li>
                            <li>
                                Maaaring mainit at tuyo ang balat (hindi pinagpapawisan), o basang-basa pa rin sa pawis
                            </li>
                        </ul>

                        <p className="firstaid label">Agad na Lunas:</p>
                        <ol className="firstaid">
                            <li>TUMAWAG AGAD NG 911 (o local emergency number).</li>
                            <li>Dalhin sa malamig na lugar (sa lilim o may aircon).</li>
                            <li>Palamigin ang katawan habang naghihintay ng tulong:</li>
                            <ul>
                                <li>Hubarin ang hindi kailangang damit.</li>
                                <li>Basain ng malamig na tubig o tuwalya ang buong katawan.</li>
                                <li>Paypayan para mapabilis ang pag-evaporate ng tubig.</li>
                                <li>Lagyan ng yelo (ice packs) sa leeg, kili-kili, at singit.</li>
                            </ul>
                            <li>HUWAG piliting painumin kung nalilito o walang malay.</li>
                            </ol>
                    </div>
                </div>

                {/* EXHAUSTION */}
                <div className={`accordion exhaustion ${isOpen.exhaustion ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("exhaustion")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M4.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
                            <path d="M16.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
                            <path d="M10.072 10.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Heat Exhaustion</h4>
                            <span className="danger">DELIKADO</span>
                        </div>
                        <svg
                            className={`nav-btn-icon caret ${isOpen.exhaustion ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />
                        <p className="description">
                            Matinding pagod dahil sa init. Pwedeng mauwi sa Heat Stroke kung hindi naagapan.
                        </p>

                        <p className="symptoms label">Senyales:</p>
                        <ul className="symptoms">
                            <li>Matindi at maraming pawis</li>
                            <li>Maputla at malamig na balat (clammy skin)</li>
                            <li>Pagkahilo, pagkapagod, panghihina</li>
                            <li>Sakit ng ulo</li>
                            <li>Pagduduwal o pagsusuka</li>
                            <li>Mabilis pero mahinang pulso</li>
                        </ul>
                        
                        <p className="firstaid label">Agad na Lunas:</p>
                        <ol className="firstaid">
                            <li>Pumunta agad sa malamig na lugar at magpahinga.</li>
                            <li>Uminom ng tubig o sports drink (paunti-unti).</li>
                            <li>Luagan ang damit.</li>
                            <li>Magpalamig: Gumamit ng malamig na tuwalya sa balat o maligo sa malamig na tubig.</li>
                            <li>Humiga at itaas nang bahagya ang mga paa.</li>
                            <li>Magpatingin sa doktor kung sumuka, lumala ang sintomas, o hindi bumuti ang pakiramdam pagkatapos ng 1 oras.</li>
                        </ol>
                    </div>
                </div>

                {/* CRAMPS */}
                <div className={`accordion cramps ${isOpen.cramps ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("cramps")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 12h5l4 8v-16l4 8h5" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Heat Cramps</h4>
                            <span className="danger">MAG-INGAT</span>
                        </div>
                        <svg
                            className={`nav-btn-icon caret ${isOpen.cramps ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />
                        <p className="description">Maagang senyales na nauubusan na ng tubig at asin ang katawan.</p>
                        
                        <p className="symptoms label">Senyales:</p>
                        <ul className="symptoms">
                            <li>Pamumulikat (muscle spasms) o pananakit ng kalamnan, karaniwan sa binti, braso, o tiyan</li>
                            <li>Nangyayari habang o pagkatapos mag-ehersisyo sa init</li>
                        </ul>

                        <p className="firstaid label">Agad na Lunas:</p>
                        <ol className="firstaid">
                            <li>Itigil ang anumang mabigat na gawain at magpahinga sa malamig na lugar.</li>
                            <li>Uminom ng tubig o sports drink na may electrolytes.</li>
                            <li>Dahan-dahang i-stretch at i-masahe ang apektadong kalamnan.</li>
                            <li>HUWAG bumalik sa mabigat na gawain sa loob ng ilang oras, kahit bumuti na ang pakiramdam.</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* WHO IS MOST AT RISK */}
            <div className="base-widget raised-widget settings-widget atrisk">
                <h3 className="widget-title">Sino ang Mas Nanganganib</h3>

                {/* CHILDREN */}
                <div className={`accordion children ${isOpen.children ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("children")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3.5 17.5c5.667 4.667 11.333 4.667 17 0" />
                            <path d="M19 18.5l-2 -8.5l1 -2l2 1l1.5 -1.5l-2.5 -4.5c-5.052 .218 -5.99 3.133 -7 6h-6a3 3 0 0 0 -3 3" />
                            <path d="M5 18.5l2 -9.5" />
                            <path d="M8 20l2 -5h4l2 5" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Mga Bata at Sanggol</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Hindi pa ganap na developed ang kanilang body temperature control. Mas mabilis silang uminit.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Hinding-hindi dapat iniiwan sa loob ng nakaparadang sasakyan, kahit saglit lang.</li>
                            <li>Laging painumin ng tubig. Sila ay hindi magsasabi na nauuhaw sila.</li>
                            <li>Damitan ng manipis at maluwag na damit.</li>
                        </ul>
                    </div>
                </div>

                {/* ELDERLY */}
                <div className={`accordion elderly ${isOpen.elderly ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("elderly")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M11 21l-1 -4l-2 -3v-6" />
                            <path d="M5 14l-1 -3l4 -3l3 2l3 .5" />
                            <path d="M8 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                            <path d="M7 17l-2 4" />
                            <path d="M16 21v-8.5a1.5 1.5 0 0 1 3 0v.5" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Matatanda (65+ years old)</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Mas mabagal ang cooling mechanism ng katawan at minsan ay hindi na nila nararamdaman na sila ay nauuhaw.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Regular na i-check ang kanilang kalagayan (e.g., tawagan o bisitahin). Huwag umasa na sila ang magsasabi na nahihirapan na sila.</li>
                            <li>Siguraduhin na ang kanilang tinitirhan ay may bentilador (e-fan) o access sa malamig na lugar.</li>
                            <li>Paalalahanan silang uminom ng tubig, kahit hindi nauuhaw.</li>
                        </ul>
                    </div>
                </div>

                {/* OUTDOOR WORKERS */}
                <div className={`accordion outdoor ${isOpen.outdoor ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("outdoor")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 1 0 -4 0v8.5" />
                            <path d="M4 9h4" />
                            <path d="M13 16a4 4 0 1 0 0 -8a4.07 4.07 0 0 0 -1 .124" />
                            <path d="M13 3v1" />
                            <path d="M21 12h1" />
                            <path d="M13 20v1" />
                            <path d="M19.4 5.6l-.7 .7" />
                            <path d="M18.7 17.7l.7 .7" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Mga Nagtatrabaho sa Labas</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Sila ang direktang exposed sa araw at init sa loob ng maraming oras.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Ito ang mga power users ng PRESKO. Hikayatin silang gamitin ang 24-hour forecast para i-plano ang kanilang pinaka-mabibigat na gawain sa mas malamig na oras.</li>
                            <li>Mag-break nang mas madalas sa lilim o sa isang PreskoSpot.</li>
                        </ul>
                    </div>
                </div>

                {/* ILL */}
                <div className={`accordion ill ${isOpen.ill ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("ill")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M20.207 3.793a5.95 5.95 0 0 1 0 8.414l-8 8a5.95 5.95 0 0 1 -8.414 -8.414l8 -8a5.95 5.95 0 0 1 8.414 0m-7 1.414l-4.294 4.293l5.586 5.586l4.294 -4.292a3.95 3.95 0 1 0 -5.586 -5.586" />
                        </svg>
                        <div className="container">
                            <h4 className="name">May Sakit o Umiinom ng Maintenance na Gamot</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Ang mga may sakit (lalo na sa puso, high blood, diabetes) ay mas nahihirapang mag-adjust sa init. Ang ibang mga gamot (tulad ng diuretics) ay nakaka-dagdag ng risk.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Doble-ingat. Huwag mag-babad sa init.</li>
                            <li>Mag-konsulta sa doktor kung paano nakaka-apekto ang kanilang gamot sa init.</li>
                        </ul>
                    </div>
                </div>

                {/* PREGNANT */}
                <div className={`accordion pregnant ${isOpen.pregnant ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("pregnant")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M8 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M2 5h2.5l1.632 4.897a6 6 0 0 0 5.693 4.103h2.675a5.5 5.5 0 0 0 0 -11h-.5v6" />
                            <path d="M6 9h14" />
                            <path d="M9 17l1 -3" />
                            <path d="M16 14l1 3" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Mga Buntis</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Mas mataas ang kanilang base body temperature at ang kanilang katawan ay mas nagsisikap na palamigin ang sarili at si baby.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Uminom ng extra na tubig.</li>
                            <li>Iwasan ang matagal na pagtayo sa init. Magpahinga agad kapag nakaramdam ng hilo.</li>
                        </ul>
                    </div>
                </div>

                {/* UNPRIVILEGED */}
                <div className={`accordion unprivileged ${isOpen.unprivileged ? "open" : ""}`}>
                    <button className="header" onClick={() => toggleAccordion("unprivileged")}>
                        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M8 16a3 3 0 0 1 -3 3" />
                            <path d="M16 16a3 3 0 0 0 3 3" />
                            <path d="M12 16v4" />
                            <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                            <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
                        </svg>
                        <div className="container">
                            <h4 className="name">Walang Access sa Aircon o Maaliwalas na Tahanan</h4>
                        </div>
                        <svg 
                            className={`nav-btn-icon caret ${isOpen.stroke ? "rotated" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
                        </svg>
                    </button>

                    {/* Accordion Content */}
                    <div className="content">
                        <hr />

                        <p className="why label">Bakit?</p>
                        <p className="why">
                            Walang lugar para "mag-charge" at palamigin ang katawan, lalo na sa gabi.
                        </p>

                        <p className="care label">Paano Alagaan:</p>
                        <ul className="care">
                            <li>Ito ang pinaka-importanteng rason para sa PreskoSpots.</li>
                            <li>Gamitin ang PreskoSpots tab para maghanap ng pinakamalapit na library, mall, o community center kung saan pwedeng magpalamig."</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* WHY */}
            <div className="base-widget raised-widget settings-widget whyheat">
                <h3 className="widget-title">Bakit Umiinit ang Panahon?</h3>
                <hr />
                <div className="container">
                    <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" />
                        <path d="M6.343 17.657l-1.414 1.414" />
                        <path d="M6.343 6.343l-1.414 -1.414" />
                        <path d="M17.657 6.343l1.414 -1.414" />
                        <path d="M17.657 17.657l1.414 1.414" />
                        <path d="M4 12h-2" />
                        <path d="M12 4v-2" />
                        <path d="M20 12h2" />
                        <path d="M12 20v2" />
                    </svg>
                    <div className="cause">
                        <h4 className="label">GLOBAL WARMING / CLIMATE CHANGE</h4>
                        <p>Dahil sa climate change, bawat taon ay nagiging mas mainit sa buong mundo, kasama na ang Pilipinas.</p>
                    </div>
                </div>
                <h4 className="effects label">Epekto sa Ating Bansa:</h4>
                <ul className="effects">
                    <li>Mas matinding Heat Index tuwing tag-init (summer).</li>
                    <li>"Urban Heat Island Effect": Mas kukulob ang init sa mga siyudad tulad ng Metro Manila. Ang semento at mga gusali ay sumisipsip ng init, at kulang sa puno para magpalamig.</li>
                    <li>Mas mahabang tag-init at mas pabago-bagong panahon.</li>
                    <li>Mas madalas na class suspensions at pag-iingat sa mga outdoor event.</li>
                </ul>
                <p className="sources"><i>Sources: PAGASA, DOH, World Meteorological Organization</i></p>
            </div>

            {/* CALL TO ACTION */}
            <div className="base-widget raised-widget settings-widget action">
                <h3 className="widget-title">Ano ang Magagawa Mo?</h3>
                <hr />
                <div className="container">
                    <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 12l5 5l10 -10" />
                    </svg>
                    <div className="text">
                        <h4>Mag-plano Gamit ang PRESKO</h4>
                        <p>Gamitin ang 24-hour forecast para i-schedule ang iyong mga lakad at trabaho sa mas malamig na oras.</p>
                    </div>
                </div>
                <div className="container">
                    <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 12l5 5l10 -10" />
                    </svg>
                    <div className="text">
                        <h4>Maghanap ng PreskoSpots</h4>
                        <p>Buksan ang PreskoSpots tab para maghanap ng libreng pampalamigan na malapit sa iyo (library, mall, park, etc.).</p>
                    </div>
                </div>
                <div className="container">
                    <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 12l5 5l10 -10" />
                    </svg>
                    <div className="text">
                        <h4>Maging Mapanuri sa Kapwa (Community Care)</h4>
                        <p>Tulungan at i-check ang iyong mga kapitbahay, lalo na ang mga matatanda (65+) at mga bata. I-share ang PRESKO app sa kanila.</p>
                    </div>
                </div>
                <div className="container">
                    <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 12l5 5l10 -10" />
                    </svg>
                    <div className="text">
                        <h4>Palaguin ang Community</h4>
                        <p>May alam ka bang preskong lugar? I-share at i-suggest ito sa loob ng PRESKO app para matulungan din ang iba!</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoSubPage;
