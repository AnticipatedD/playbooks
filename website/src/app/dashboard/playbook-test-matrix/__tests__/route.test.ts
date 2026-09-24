import { describe, it, expect } from 'vitest';
import { classifyRunner, buildMatrix, type RunnerInfo } from '../../../../components/dashboard/RunnerMatrix';

describe('Dashboard Playbook Test Matrix Suite', () => {
  const mockRunners: RunnerInfo[] = [
    {
      runner_id: 101,
      runner_name: "amd-halo-win-01",
      os: "windows",
      status: "online",
      busy: false,
      labels: ["self-hosted", "halo"]
    },
    {
      runner_id: 102,
      runner_name: "amd-stx-linux-02",
      os: "linux",
      status: "online",
      busy: true,
      labels: ["self-hosted", "stx"]
    }
  ];

  it('should correctly classify runner metadata profiles by hardware type and OS labels', () => {
    const classification1 = classifyRunner(mockRunners[0]);
    expect(classification1.hardware).toBe("Ryzen™ AI Max");
    expect(classification1.os).toBe("Windows");

    const classification2 = classifyRunner(mockRunners[1]);
    expect(classification2.hardware).toBe("Ryzen™ AI 300 HX");
    expect(classification2.os).toBe("Linux");
  });

  it('should group mapped runners structurally within the matrix configuration bounds', () => {
    const matrix = buildMatrix(mockRunners);
    
    // Validate structural mapping existence
    expect(matrix).toHaveProperty("Ryzen™ AI Max");
    expect(matrix["Ryzen™ AI Max"]).toHaveProperty("Windows");
    
    // Assert target array aggregation limits
    const windowsCell = matrix["Ryzen™ AI Max"]["Windows"];
    expect(windowsCell.runners).toHaveLength(1);
    expect(windowsCell.runners[0].runner_id).toBe(101);
  });
});
