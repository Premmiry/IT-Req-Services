export interface SubTopic {
    subtopic_id: number;
    topic_id: number;
    subtopic_name: string;
    pattern: string;
    check_m: number;
    check_d: number;
    check_it_m: number;
    check_it_d: number;
    del_flag: string;
    knowledge: string;
}

export interface SubTopicDialogProps {
    open: boolean;
    onClose: () => void;
    topicId: number;
    onSave: () => void;
    subTopics: SubTopic[];
    subTopicId?: number;
}

export interface SubTopicListProps {
    topicId: number;
}