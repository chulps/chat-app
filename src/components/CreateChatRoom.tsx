import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

const CreateChatRoom: React.FC = () => {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const { getToken } = useAuth();
    const { apiUrl } = getEnv();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/api/chatrooms`, { name, isPublic }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            console.log('Chatroom created:', response.data);
        } catch (error) {
            console.error('Error creating chatroom:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Chatroom Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Public Chatroom
                </label>
            </div>
            <button type="submit">Create Chatroom</button>
        </form>
    );
};

export default CreateChatRoom;
