// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
    addTask,
    getTasksByDate,
    removeTask,
    toggleDone,
    updateTitle,
} from '../db/db';

export default function TaskList({ date, onDataChanged }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    // завантажуємо задачі для вибраної дати
    async function loadTasks() {
        const rows = await getTasksByDate(date);
        setTasks(rows);
    }

    useEffect(() => {
        loadTasks();
    }, [date]);

    // додати нову задачу
    async function addNewTask() {
        if (!newTask.trim()) return;
        await addTask(date, newTask.trim());
        setNewTask('');
        await loadTasks();
        if (onDataChanged) onDataChanged();
    }

    // перемикання "виконано"
    async function toggleTask(task) {
        await toggleDone(task.id, !task.done);
        await loadTasks();
        if (onDataChanged) onDataChanged();
    }

    // почати редагування
    function startEditTask(task) {
        setEditId(task.id);
        setEditText(task.title);
    }

    // зберегти редагування
    async function saveEditTask() {
        if (!editText.trim()) return;
        await updateTitle(editId, editText.trim());
        setEditId(null);
        setEditText('');
        await loadTasks();
        if (onDataChanged) onDataChanged();
    }

    // видалити задачу
    async function deleteTask(id) {
        await removeTask(id);
        await loadTasks();
        if (onDataChanged) onDataChanged();
    }

    const header = format(date, 'd LLLL yyyy', { locale: uk });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Задачі на {header}</Text>

            <View style={styles.addRow}>
                <TextInput
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder="Нова задача..."
                    style={styles.input}
                    onSubmitEditing={addNewTask}
                />
                <TouchableOpacity style={styles.addBtn} onPress={addNewTask}>
                    <Ionicons name="add-circle-outline" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={<Text style={styles.empty}>Немає задач</Text>}
                renderItem={({ item }) => (
                    <View style={styles.taskRow}>
                        <TouchableOpacity onPress={() => toggleTask(item)}>
                            <Ionicons
                                name={item.done ? 'checkbox-outline' : 'square-outline'}
                                size={22}
                                color="#0078d7"
                            />
                        </TouchableOpacity>

                        {editId === item.id ? (
                            <>
                                <TextInput
                                    value={editText}
                                    onChangeText={setEditText}
                                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                                    autoFocus
                                />
                                <TouchableOpacity style={styles.okBtn} onPress={saveEditTask}>
                                    <Ionicons name="checkmark-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        setEditId(null);
                                        setEditText('');
                                    }}
                                >
                                    <Ionicons name="close-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text
                                    style={[styles.taskText, item.done && styles.done]}
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>
                                <TouchableOpacity onPress={() => startEditTask(item)}>
                                    <Ionicons name="pencil-outline" size={20} color="#444" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                    <Ionicons name="trash-outline" size={20} color="#ff5c5c" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f6f6', padding: 12 },
    header: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    input: {
        flex: 0.9,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    addBtn: {
        marginLeft: 8,
        backgroundColor: '#0078d7',
        borderRadius: 8,
        padding: 6,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginRight:'8%',
    },
    taskText: { flex: 1, fontSize: 15, color: '#111', marginLeft: 8 },
    done: { textDecorationLine: 'line-through', color: '#888' },
    okBtn: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        padding: 6,
        marginLeft: 6,
    },
    cancelBtn: {
        backgroundColor: '#888',
        borderRadius: 8,
        padding: 6,
        marginLeft: 6,
    },
    empty: { color: '#666', textAlign: 'center', marginTop: 12 },
});
