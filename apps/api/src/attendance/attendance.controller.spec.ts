import { AttendanceController } from './attendance.controller';

describe('AttendanceController', () => {
  it('delegates attendance statistics to the service', async () => {
    const service = {
      getAttendanceStatistics: jest.fn().mockResolvedValue({ troop: {} }),
    };
    const controller = new AttendanceController(service as never);

    await expect(controller.getAttendanceStatistics('troop-1')).resolves.toEqual({
      troop: {},
    });
    expect(service.getAttendanceStatistics).toHaveBeenCalledWith('troop-1');
  });
});
