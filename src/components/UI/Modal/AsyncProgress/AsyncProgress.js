import React from 'react';
import styles from './AsyncProgress.module.css';
import Spinner from '../../Spinner/Spinner';
import Button from '../../Button/Button';

const AsyncProgress = ({
    error,
    loading,
    heading,
    mainContent,
    buttons
}) => {
    let displayedHeading;
    let displayedMainContent;
    let displayedButtons;
    if (loading) {
        displayedHeading = (
            <h2 className='dark'>{heading.loading}</h2>
        );
        displayedMainContent = (
            <Spinner withWrapper />
        );
    } else if (error) {
        displayedHeading = (
            <h2 className='danger'>{heading.fail}</h2>
        );
        displayedMainContent = (
            <p>{mainContent.fail}</p>
        );
        displayedButtons = buttons.fail
            .map(({ theme, content, clickHandler }) => {
                const themeObj = {};
                themeObj[theme] = true;
                return (
                    <Button
                        key={theme}
                        {...themeObj}
                        clicked={clickHandler}
                    >
                        {content}
                    </Button>
                );
            })
    } else {
        displayedHeading = (
            <h2 className='success'>{heading.success}</h2>
        );
        displayedMainContent = (
            <p>{mainContent.success}</p>
        );
        displayedButtons = buttons.success
            .map(({ theme, content, clickHandler }) => {
                const themeObj = {};
                themeObj[theme] = true;
                return (
                    <Button
                        key={theme}
                        {...themeObj}
                        clicked={clickHandler}
                    >
                        {content}
                    </Button>
                );
            })
    };

    return (
        <div className={styles.asyncProgress}>
            {displayedHeading}
            {displayedMainContent}
            <div className={styles.btns}>
                {displayedButtons}
            </div>
        </div>
    );
}

export default AsyncProgress;