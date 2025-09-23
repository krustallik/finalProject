import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { addTask, getTasksByDate, removeTask, toggleDone, updateTitle } from '../db/db';

export default function TaskList({ date, onDataChanged }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    async function loadTasks() {
        const rows = await getTasksByDate(date);
        setTasks(rows);
    }

    useEffect(() => { loadTasks(); }, [date]);

    async function addNewTask() {
        if (!newTask.trim()) return;
        await addTask(date, newTask.trim());
        setNewTask('');
        await loadTasks();
        onDataChanged?.();
    }

    async function toggleTask(task) {
        await toggleDone(task.id, !task.done);
        await loadTasks();
        onDataChanged?.();
    }

    function startEditTask(task) {
        setEditId(task.id);
        setEditText(task.title);
    }

    async function saveEditTask() {
        if (!editText.trim()) return;
        await updateTitle(editId, editText.trim());
        setEditId(null);
        setEditText('');
        await loadTasks();
        onDataChanged?.();
    }

    async function deleteTask(id) {
        await removeTask(id);
        await loadTasks();
        onDataChanged?.();
    }

    const header = format(date, 'd LLLL yyyy', { locale: uk });

    return (
        <View style={s.container}>
            <Text style={s.header}>{t('tasks.headerOnDate', { date: header })}</Text>

            <View style={s.addRow}>
                <TextInput
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder={t('tasks.newPlaceholder')}
                    placeholderTextColor={colors.border}
                    style={s.input}
                    onSubmitEditing={addNewTask}
                />
                <TouchableOpacity style={s.addBtn} onPress={addNewTask}>
                    <Ionicons name="add-circle-outline" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={<Text style={s.empty}>{t('tasks.empty')}</Text>}
                renderItem={({ item }) => (
                    <View style={s.taskRow}>
                        <TouchableOpacity onPress={() => toggleTask(item)}>
                            <Ionicons
                                name={item.done ? 'checkbox-outline' : 'square-outline'}
                                size={22}
                                color={colors.primary}
                            />
                        </TouchableOpacity>

                        {editId === item.id ? (
                            <>
                                <TextInput
                                    value={editText}
                                    onChangeText={setEditText}
                                    style={[s.input, { flex: 1, marginLeft: 8 }]}
                                    autoFocus
                                />
                                <TouchableOpacity style={s.okBtn} onPress={saveEditTask}>
                                    <Ionicons name="checkmark-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={s.cancelBtn}
                                    onPress={() => { setEditId(null); setEditText(''); }}
                                >
                                    <Ionicons name="close-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={[s.taskText, item.done && s.done]} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <TouchableOpacity onPress={() => startEditTask(item)}>
                                    <Ionicons name="pencil-outline" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                    <Ionicons name="trash-outline" size={20} color={colors.notification || '#ff5c5c'} />
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

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, padding: 12 },
        header: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: colors.text },
        addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
        input: {
            flex: 0.9,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
        },
        addBtn: {
            marginLeft: 8,
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 6,
        },
        taskRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 10,
            marginRight: '8%',
            borderWidth: 1,
            borderColor: colors.border,
            gap: 8,
        },
        taskText: { flex: 1, fontSize: 15, color: colors.text, marginLeft: 8 },
        done: { textDecorationLine: 'line-through', color: colors.border },
        okBtn: { backgroundColor: '#28a745', borderRadius: 8, padding: 6, marginLeft: 6 },
        cancelBtn: { backgroundColor: '#888', borderRadius: 8, padding: 6, marginLeft: 6 },
        empty: { color: colors.text, opacity: 0.6, textAlign: 'center', marginTop: 12 },
    });
