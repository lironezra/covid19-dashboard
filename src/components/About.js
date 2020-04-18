import React from 'react';

const About = () => {
    return (
        <div className="project-info-wrapper">
            <div className="content">
                <p>Developed by Liron Ezra</p>
                <p>Data sources: <a href="https://corona.lmao.ninja/docs/">NOVELCovid/API.</a></p>
                <p>GitHub project repository: <a href="https://github.com/lironezra/covid19-dashboard">Here.</a></p>
                <br />
                <p>                
                <strong>Confirmed</strong> cases include presumptive positive cases.
                <br />
                <strong>Recovered</strong> cases outside China are estimates based on local media reports, and may be substantially lower than the true number.
                <br />
                <strong>Active cases</strong> = total confirmed - total recovered - total deaths.
                </p>
                <br />
                <p>Navigte to country by clicking one of the countries in <strong>Confirmed/Recovered/Deaths</strong> list.</p>
                <p><strong>Time Zones</strong>: lower-left corner indicator - your local time; lower-right corner plot - UTC. </p>
            </div>
        </div>
    );
};

export default About;