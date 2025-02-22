import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSearch, editTeam, removeLoomian } from '../Redux/store';
import loomianJSON from '../JSON/Loomians.json';
import styles from './Search.module.scss';

const Search = (props) => {
    // Redux
    const dispatch = useDispatch();
    const { searchOn } = useSelector((state) => state.search);

    // React
    const Loomians = Object.values(loomianJSON);
    const initialLoomian = props.loomianID ? Loomians.find((loomian) => loomian.loomipedia_id === props.loomianID) : null;

    const [selectedLoomian, setSelectedLoomian] = useState(initialLoomian);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLoomians = Loomians.filter((loomian) =>
        loomian.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerRef = useRef(null);
    const inputRef = useRef(null);
   
    const closeSearch = () => {
        if (containerRef.current) {
            containerRef.current.classList.replace('fadeIn', 'fadeOut');

            setTimeout(() => {
                dispatch(toggleSearch());
            }, 300);
        }
    };

    const addLoomianToTeam = () => {
        dispatch(editTeam({ index: props.index, loomian: selectedLoomian, type: selectedLoomian.type }));
        closeSearch();
    };

    const removeLoomianFromTeam = () => {
        dispatch(removeLoomian(props.index));
        closeSearch();
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && event.target === containerRef.current) closeSearch();
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {searchOn && (
                <div ref={containerRef} className={`${styles.searchContainer} fadeIn`}>
                    <div className={styles.search}>
                        <i onClick={closeSearch} className={`fas fa-times ${styles.icon}`}></i>

                        <div className={styles.inputContainer}>
                            <input name='loomianQuery' autoComplete='off' spellCheck="false" className={styles.input} ref={inputRef} type="text" placeholder="Search Loomian.." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <i className={`fas fa-search ${styles.icon}`}></i>
                        </div>

                        <div className={styles.loomiansList}>
                            {filteredLoomians.map((loomian, index) => (
                                <div key={index} 
                                    className={`${styles.loomianCard} ${selectedLoomian && selectedLoomian.loomipedia_id === loomian.loomipedia_id ? styles.selected : ''}`}
                                    onClick={() => setSelectedLoomian(loomian)}>
                                    <img className={styles.loomian} src={`/sprites/${loomian.loomipedia_id}.webp`} alt={loomian.name}/>
                                </div>
                            ))}
                        </div>

                        <div className={styles.currentLoomian}>
                            <span>Selected Loomian: </span>
                            {selectedLoomian ? (
                                <img className={styles.loomian} src={`/sprites/${selectedLoomian.loomipedia_id}.webp`} alt={selectedLoomian.name} />
                            ) : (
                                <span>&nbsp;None</span>
                            )}
                        </div>
                        
                        <div className={styles.iconContainer}>
                            <i onClick={removeLoomianFromTeam} className={`fas fa-trash ${styles.delete} ${styles.icon}`}></i>
                            <i onClick={addLoomianToTeam} className={`fas fa-check ${styles.add} ${styles.icon}`}></i>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Search;
