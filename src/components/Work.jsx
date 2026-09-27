import Project from './Project'

import project1Image1 from '../assets/image/project1.2.jpg'
import project1Image2 from '../assets/image/project1.3.jpg'
import project1Image3 from '../assets/image/project1.4.jpg'

import project2Image1 from '../assets/image/project2.1.jpg'
import project2Image2 from '../assets/image/project2.2.jpg'

function Work() {
    const projects = [
        {
            id: 1,
            title: 'Project 1: Vehicle Driver Monitoring and Safety Alert System',
            description:
                'This project is a vehicle safety system designed to monitor driver behaviour and improve road safety. It uses sensors and alert components to detect unsafe situations and warn the driver in real time.',
            link: 'https://www.instructables.com/Vehicle-Driver-Monitoring-and-Safety-Alert-System/',
            images: [project1Image1, project1Image2, project1Image3],
        },
        {
            id: 2,
            title: 'Project 2: Audio Lighting System',
            description:
                'This project uses voice commands to control lights and an exhaust fan. The Raspberry Pi processes the audio input, while the Arduino controls the lights and fan using Bluetooth communication.',
            images: [project2Image1, project2Image2],
        },
    ]

    return (
        <section className="work" id="work">
            <h2>Work</h2>
            <p>Here are what I have done so far:</p>

            {projects.map((project) => (
                <Project
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    link={project.link}
                    images={project.images}
                />
            ))}
        </section>
    )
}

export default Work