import React, { useState } from 'react'
import { ScrollView, Modal, KeyboardAvoidingView, TextInput, Picker, View, Text } from 'react-native'
import Button from '../../Button'
import Feedback from '../../Feedback'
import MapModal from '../../MapModal'
import styles from './styles'
import { colors } from '../../../constants'

export default function StepOne({ onToStepTwo, error }) {
    const [name, setName] = useState()
    const [resort, setResort] = useState()
    const [modalVisibility, setModalVisibility] = useState(false)
    const [flow, setFlow] = useState()
    const [location, setLocation] = useState()
    const [size, setSize] = useState('m')
    const [level, setLevel] = useState('begginer')

    const handleNextStep = () => onToStepTwo(name, resort, location, flow, level, size)

    const handleAddLocation = (location) => {
        setLocation(location)
        handleModalToggle()
    }

    const handleModalToggle = () => setModalVisibility(!modalVisibility)

    return (
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView scrollEnabled={true}>
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput selectionColor={colors.BACKGROUND} placeholder='Eg: Oberjoch Park' style={styles.textInput} onChangeText={(text) => setName(text)} />
                        </View>

                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Resort:</Text>

                            <TextInput selectionColor={colors.BACKGROUND} placeholder='Eg: Grindelwald' style={styles.textInput} onChangeText={(text) => setResort(text)} />
                        </View>

                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Flow:</Text>
                            <TextInput selectionColor={colors.BACKGROUND} placeholder='Eg: Jib/Rail garden' style={styles.textInput} onChangeText={(text) => setFlow(text)} />
                        </View>

                        <View style={{ justifyContent: 'space-between' }}>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.label}>Size: </Text>
                                <Picker
                                    selectedValue={size}
                                    style={styles.picker}
                                    itemStyle={{ height: 40 }}
                                    onValueChange={value =>
                                        setSize(value)
                                    }>
                                    <Picker.Item label="Small" value="s" />
                                    <Picker.Item label="Medium" value="m" />
                                    <Picker.Item label="Large" value="l" />
                                    <Picker.Item label="Massive" value="xl" />
                                </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.label}>Level:</Text>
                                <Picker
                                    selectedValue={level}
                                    style={styles.picker}
                                    itemStyle={{ height: 40 }}
                                    onValueChange={value =>
                                        setLevel(value)
                                    }>
                                    <Picker.Item label="Begginer" value="begginer" />
                                    <Picker.Item label="Intermediate" value="intermediate" />
                                    <Picker.Item label="Advanced" value="advanced" />
                                    <Picker.Item label="Only for rippers" value="ripper" />
                                </Picker>
                            </View>
                        </View>

                        <Button style={styles.buttonContainer} textStyle={styles.button} text='Set Location' onPress={handleModalToggle} />
                    </View>

                    <MapModal addLocation={handleAddLocation} visibility={modalVisibility} modalToggle={handleModalToggle} />

                    {error && <Feedback level='warn' message={error} />}
                    <Button text='Next' style={styles.nextButton} textStyle={styles.button} onPress={handleNextStep} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    )
}
