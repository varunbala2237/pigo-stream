// RelationPanel.js
import { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const RelationPanel = ({ animeInfo, selectedRelationIndex, onRelationChange, relationScrollRef }) => {
    useEffect(() => {
        if (relationScrollRef.current) {
            const items = relationScrollRef.current.querySelectorAll('.card');
            const selectedItem = items[selectedRelationIndex];

            if (selectedItem) {
                const container = relationScrollRef.current;
                const containerRect = container.getBoundingClientRect();
                const itemRect = selectedItem.getBoundingClientRect();

                const offset = itemRect.left - containerRect.left;
                const scrollAdjustment = offset - (container.clientWidth / 2) + (itemRect.width / 2);

                container.scrollBy({
                    left: scrollAdjustment,
                    behavior: 'instant',
                });
            }
        }
    }, [relationScrollRef, selectedRelationIndex]);

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -450 : 450,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
            <div className="d-flex flex-row dynamic-ts mb-2">
                <i className="bi bi-layers me-2"></i>
                Related Anime
            </div>

            <div className="d-flex justify-content-between align-items-stretch">
                <div
                    ref={relationScrollRef}
                    className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {animeInfo.map((entry, index) => {
                        const { title, coverImage, startDate, format } = entry;

                        const displayTitle = title?.english || title?.romaji || 'Untitled';
                        const dateString = startDate?.year ? `${startDate.month || '--'}/${startDate.day || '--'}/${startDate.year}` : 'Unknown';

                        return (
                            <div
                                key={entry.id}
                                className={
                                    `card text-white border-0 shadow-sm custom-theme-radius-low 
                                    ${selectedRelationIndex === index ? 'bg-secondary' : 'bd-callout-dark'}`
                                }
                                style={{ minWidth: '160px', maxWidth: '160px' }}
                                onClick={() => onRelationChange(index)}
                                role="button"
                            >
                                <img
                                    src={coverImage?.large || `https://placehold.co/200x300/212529/6c757d?text=?`}
                                    className="custom-theme-radius-top-low"
                                    alt="empty"
                                    style={{ height: '240px', objectFit: 'cover' }}
                                />
                                <div className={`card-body p-2`}>
                                    <div className="d-flex align-items-center dynamic-fs">
                                        <span className="fw-bold theme-color me-2">{index}</span>
                                        <Tippy
                                            content={displayTitle}
                                            placement="top"
                                            delay={[500, 0]}
                                            trigger="mouseenter focus click"
                                            interactive={true}
                                        >
                                            <span className="text-truncate flex-grow-1 d-inline-block" style={{ maxWidth: '100%' }}>
                                                {displayTitle}
                                            </span>
                                        </Tippy>
                                    </div>
                                    <div className={
                                        `d-flex justify-content-between align-items-center dynamic-ss
                                        ${selectedRelationIndex === index ? 'text-dark' : 'text-secondary'}`
                                    }>
                                        <span>{dateString}</span>
                                        <span>{format}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Vertical scroll buttons */}
                <div className="d-flex flex-column ms-2 align-self-stretch">
                    <button
                        className="btn btn-dark bd-callout-dark flex-fill py-2"
                        onClick={() => scroll(relationScrollRef, 'left')}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                        className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
                        onClick={() => scroll(relationScrollRef, 'right')}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RelationPanel;