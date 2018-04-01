import serial


class MotorController:
    def __init__(self):
        self.ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
        self.ser.write('cat > /dev/ttyACM0'.encode('ascii'))

    def lock(self):
        self.ser.write('1\n'.encode('ascii'))
        self.ser.flush()

    def unlock(self):
        self.ser.write('2\n'.encode('ascii'))
        self.ser.flush()
