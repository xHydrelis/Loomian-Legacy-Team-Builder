import styles from './TeamBuilder.module.scss';
import typesJSON from '../JSON/Types.json';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toggleSearch } from '../Redux/store';
import Search from '../Search Component/Search';

const TeamBuilder = () => {
    // Redux
    const { team } = useSelector((state) => state.loomiansTeam);
    const { searchOn } = useSelector((state) => state.search);
    const dispatch = useDispatch();

    // React
    const [index, setIndex] = useState(0);
    const [loomianID, setLoomianID] = useState('001');

    const Types = Object.entries(typesJSON);

    const editLoomian = (i, loomipedia_id) => {
        setIndex(i);
        setLoomianID(loomipedia_id);
        dispatch(toggleSearch());
    };

    const teamDefense = {};
    Types.forEach(([typeKey]) => {
        teamDefense[typeKey] = 0;
    });

    team.forEach((loomian) => {
        loomian.type.forEach((subType) => {
            const subTypeData = typesJSON[subType];
            if (!subTypeData) return;

            Types.forEach(([defensiveType]) => {
                if (subTypeData.weak_to.includes(defensiveType)) {
                    teamDefense[defensiveType] -= 1;
                }

                if (subTypeData.resists.includes(defensiveType) || subTypeData.immune_to.includes(defensiveType)) {
                    teamDefense[defensiveType] += 1;
                }
            });
        });
    });

    const coverage = {};
    Types.forEach(([typeKey]) => {
        coverage[typeKey] = 0;
    });

    team.forEach((loomian) => {
        loomian.type.forEach((loomianSubType) => {
            const loomianSubTypeData = typesJSON[loomianSubType];
            if (!loomianSubTypeData) return;
        });
    });

    Types.forEach(([targetTypeKey, targetTypeValue]) => {
        team.forEach((loomian) => {
            const hitsSuperEffective = loomian.type.some((loomianSubType) =>
                targetTypeValue.weak_to.includes(loomianSubType)
            );

            if (hitsSuperEffective) coverage[targetTypeKey] += 1;
        });
    });

    return (
        <div className={styles.teamBuilderContainer}>
            <h1 className={styles.title}>Loomian Legacy Team Builder</h1>
            <p className={styles.madeBy}>Made by Hydrelis</p>

            <div className={styles.teamBuilder}>

                <div className={styles.loomiansContainer}>
                    <div className={styles.loomiansTeam}>
                        {team.map((loomian, idx) => (
                            <div key={idx} onClick={() => editLoomian(idx, loomian.loomipedia_id)} className={styles.loomianCard}>
                                {loomian.loomipedia_id === '000' ? (
                                    <i className={`fa-solid fa-question ${styles.icon}`}></i>
                                ) : (
                                    <img src={`/sprites/${loomian.loomipedia_id}.webp`} alt="loomian" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="horizontalLine" />

                    <div className={styles.teamInfoContainer}>
                        <div className={styles.teamDefensesContainer}>
                            <p className={styles.title}>Team Defense{' '}
                                <i className={`fas fa-info-circle ${styles.infoIcon}`}>
                                    <span className={`${styles.info} fadeIn`}>
                                        <span className={styles.topArrow} />
                                        Team Defense is the sum of how many weaknesses and resistances your team has for each type.
                                    </span>
                                </i>
                            </p>

                            <div className={styles.teamDefenses}>
                                {Types.filter(([typeKey]) => typeKey !== "Unknown").map(([typeKey]) => (
                                    <div key={typeKey} className={styles.type}>
                                        <img className={styles.img} src={`/types/${typeKey}.webp`} alt={typeKey} />
                                        <div className={styles.typeInfo}>
                                            <div className={styles.topArrow} />
                                            <p className={`${styles.typeValue} ${teamDefense[typeKey] > 0 ? styles.good : teamDefense[typeKey] < 0 ? styles.bad : ''}`}>
                                                {teamDefense[typeKey]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.coverageContainer}>
                            <p className={styles.title}>Coverage{' '}
                                <i className={`fas fa-info-circle ${styles.infoIcon}`}>
                                    <span className={`${styles.info} fadeIn`}>
                                        <span className={styles.topArrow} />
                                        Coverage is how many Loomians on your team can hit each type super-effectively.
                                    </span>
                                </i>
                            </p>
                            <div className={styles.coverage}>
                                {Types.filter(([typeKey]) => typeKey !== "Unknown").map(([typeKey]) => (
                                    <div key={typeKey} className={styles.type}>
                                        <img className={styles.img} src={`/types/${typeKey}.webp`} alt={typeKey} />
                                        <div className={styles.typeInfo}>
                                            <div className={styles.topArrow} />
                                            <p className={`${styles.typeValue} ${coverage[typeKey] >= 2 ? styles.good : ''}`}>
                                                {coverage[typeKey]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {searchOn && <Search index={index} loomianID={loomianID} />}
        </div>
    );
};

export default TeamBuilder;
