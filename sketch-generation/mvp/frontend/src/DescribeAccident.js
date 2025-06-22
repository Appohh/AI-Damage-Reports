import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const damagePoints = {
    Car: [
        'Front', 'Back', 'Left Side', 'Right Side',
        'Front Left', 'Front Right', 'Back Left', 'Back Right'
    ],
    Motorcycle: [
        'Front', 'Back', 'Left Side', 'Right Side'
    ],
    Van: [
        'Front', 'Back', 'Left Side', 'Right Side',
        'Roof', 'Cargo Area'
    ]
};

function DescribeAccident() {
    const [injuryDescription, setInjuryDescription] = useState('');
    const [accidentDescription, setAccidentDescription] = useState('');
    const [propertyDamage, setPropertyDamage] = useState('no');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('Car');
    const [damagePointsSelected, setDamagePointsSelected] = useState([]);
    const [vatRecoverable, setVatRecoverable] = useState('no');
    const [insurer, setInsurer] = useState('');
    const [policyNum, setPolicyNum] = useState('');
    const [agent, setAgent] = useState('');
    const [greenNumber, setGreenNumber] = useState('');
    const [greenCardUntil, setGreenCardUntil] = useState('');
    const [damageInsured, setDamageInsured] = useState('no');
    const [visibleDamage, setVisibleDamage] = useState('');
    const [remarks, setRemarks] = useState('');
    const navigate = useNavigate();

    const handleDamagePointsChange = (option) => {
        setDamagePointsSelected((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reportData = {
                injury_description: injuryDescription,
                accident_description: accidentDescription,
                property_damage: propertyDamage,
                phone_number: phoneNumber,
                vehicle_type: vehicleType,
                damage_points: damagePointsSelected,
                vat_a: vatRecoverable,
                insurer_a: insurer,
                policy_num: policyNum,
                agent_a: agent,
                green_number: greenNumber,
                green_card_until: greenCardUntil,
                damage_insured_a: damageInsured,
                initial_impact_a: `${vehicleType}, ${damagePointsSelected.join(', ')}`,
                visible_damage_a: visibleDamage,
                remarks_a: remarks
            };

            const res = await fetch('http://localhost:8000/accidentDescription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            const data = await res.json();
            navigate('/sketch', { state: { sketchData: data.reply } });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

     return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
            <h1>Accident Report Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label><strong>Are there any injuries?</strong></label>
                    <div style={{ marginTop: '8px' }}>
                        <label>
                            <input
                                type="radio"
                                name="injury"
                                value="yes"
                                checked={injuryDescription === 'yes'}
                                onChange={(e) => setInjuryDescription(e.target.value)}
                            /> Yes
                        </label>
                        <label style={{ marginLeft: 16 }}>
                            <input
                                type="radio"
                                name="injury"
                                value="no"
                                checked={injuryDescription === 'no'}
                                onChange={(e) => setInjuryDescription(e.target.value)}
                            /> No
                        </label>
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>What happened in your own words?</strong></label>
                    <textarea
                        value={accidentDescription}
                        onChange={(e) => setAccidentDescription(e.target.value)}
                        rows={4}
                        style={{ width: '100%' }}
                        placeholder="Describe the accident..."
                        required
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Is there any property damage?</strong></label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="propertyDamage"
                                value="yes"
                                checked={propertyDamage === 'yes'}
                                onChange={() => setPropertyDamage('yes')}
                            /> Yes
                        </label>
                        <label style={{ marginLeft: 16 }}>
                            <input
                                type="radio"
                                name="propertyDamage"
                                value="no"
                                checked={propertyDamage === 'no'}
                                onChange={() => setPropertyDamage('no')}
                            /> No
                        </label>
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>What is your phone number?</strong></label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        style={{ width: '100%' }}
                        required
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>What type of vehicle was involved?</strong></label>
                    <select
                        value={vehicleType}
                        onChange={(e) => {
                            setVehicleType(e.target.value);
                            setDamagePointsSelected([]);
                        }}
                        style={{ width: '100%' }}
                    >
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Van">Van</option>
                    </select>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Where has the damage occurred?</strong></label>
                    <div>
                        {damagePoints[vehicleType].map((option) => (
                            <label key={option} style={{ marginRight: 16 }}>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={damagePointsSelected.includes(option)}
                                    onChange={() => handleDamagePointsChange(option)}
                                /> {option}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Can the insurance recover the VAT on the vehicle?</strong></label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="vatRecoverable"
                                value="yes"
                                checked={vatRecoverable === 'yes'}
                                onChange={() => setVatRecoverable('yes')}
                            /> Yes
                        </label>
                        <label style={{ marginLeft: 16 }}>
                            <input
                                type="radio"
                                name="vatRecoverable"
                                value="no"
                                checked={vatRecoverable === 'no'}
                                onChange={() => setVatRecoverable('no')}
                            /> No
                        </label>
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>What is your insurance company?</strong></label>
                    <input
                        type="text"
                        value={insurer}
                        onChange={(e) => setInsurer(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>What is the policy number?</strong></label>
                    <input
                        type="text"
                        value={policyNum}
                        onChange={(e) => setPolicyNum(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Who is your agent?</strong></label>
                    <input
                        type="text"
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Greencard number (if any):</strong></label>
                    <input
                        type="text"
                        value={greenNumber}
                        onChange={(e) => setGreenNumber(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Greencard valid until?</strong></label>
                    <input
                        type="date"
                        value={greenCardUntil}
                        onChange={(e) => setGreenCardUntil(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Is the vehicle damage insured?</strong></label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="damageInsured"
                                value="yes"
                                checked={damageInsured === 'yes'}
                                onChange={() => setDamageInsured('yes')}
                            /> Yes
                        </label>
                        <label style={{ marginLeft: 16 }}>
                            <input
                                type="radio"
                                name="damageInsured"
                                value="no"
                                checked={damageInsured === 'no'}
                                onChange={() => setDamageInsured('no')}
                            /> No
                        </label>
                    </div>
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Describe visible damage:</strong></label>
                    <textarea
                        value={visibleDamage}
                        onChange={(e) => setVisibleDamage(e.target.value)}
                        rows={2}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <label><strong>Any other remarks?</strong></label>
                    <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={2}
                        style={{ width: '100%' }}
                    />
                </div>
                <br />
                <button
                    type="submit"
                    disabled={
                        !accidentDescription ||
                        !phoneNumber ||
                        damagePointsSelected.length === 0
                    }
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default DescribeAccident;