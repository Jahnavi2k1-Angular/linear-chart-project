import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { chartData } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'linear-chart-project';
  chartData = chartData;
  tooltipData: any = null;
  selectedIndex: number = 0;
  happyimg= './Happy.jpg';

  sliderValue = 100; // Default full range
  minValue = 0;
  maxValue = 100;

  // happyimg : string = `public/Happy.jpg`

  lineChartData: any[] = [];
  view: [number, number] = [700, 400]; // Chart dimensions
  emotionImages: { [key: string]: string } = {
    happy: new URL('./images/Happy.jpg', import.meta.url).href,
    confused: 'assets/confused.jpg',
    surprised: 'assets/surprised.png',
    neutral: 'assets/neutral.jpg',
    unhappy: 'assets/unhappy.png'
  };

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Emotions';
  showYAxisLabel = true;
  yAxisLabel = 'Timestamp';

  minTimestamp!: number;
  maxTimestamp!: number;
  currentTimestamp!: number;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.processData();
    // this.lineChartData = this.transformData(this.chartData);
  }

  processData() {
    const timestamps = this.chartData.map(d => d.timestamp);
    this.minTimestamp = Math.min(...timestamps);
    this.maxTimestamp = Math.max(...timestamps);
    this.currentTimestamp = this.maxTimestamp; // Default to latest timestamp
    this.updateChartData();
  }

  updateChartData() {
    const filtered = this.chartData.filter(d => d.timestamp <= this.currentTimestamp);
    this.lineChartData = this.transformData(filtered);
  }

  transformData(data: any[]): any[] {
    const transformed: any = {};

    data.forEach(entry => {
      const timestamp = entry.timestamp.toString();
      entry.emotion_list.forEach((emotionObj: any) => {
        if (!transformed[emotionObj.emotion]) {
          transformed[emotionObj.emotion] = { name: emotionObj.emotion, series: [] };
        }
        transformed[emotionObj.emotion].series.push({
          name: timestamp,
          value: emotionObj.percent
        });
      });
    });

    return Object.values(transformed);
  }

  getEmotionImage(emotion: string): string {
    return this.emotionImages[emotion] || '';
  }

  onTooltipActivate(event: any): void {
    this.tooltipData = event.value;
  }
  
  onTooltipDeactivate(): void {
    this.tooltipData = null;
  }
}
