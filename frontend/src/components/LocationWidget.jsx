export function LocationWidget({ barangay, locality, province }) {
    return (
        <div className="widget location-widget">
            <h3 className="barangay">{barangay}</h3>
            <h5 className="locality">{locality}, {province}</h5>
        </div>
    );
}