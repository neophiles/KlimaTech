import { HeatIndexWidget } from './HeatIndexWidget'
import { AdvisoryWidget } from './AdvisoryWidget'
import { BriefingsWidget } from './BriefingsWidget'

export function Dashboard() {
    return (
        <div className='dashboard'>
            <AdvisoryWidget />
            <BriefingsWidget />
            <HeatIndexWidget />
        </div>
    );
}