'use client';

import { useId, type ComponentPropsWithoutRef } from 'react';

type QubeTXLogoProps = {
  size?: number;
  className?: string;
  color?: string;
} & Omit<ComponentPropsWithoutRef<'svg'>, 'viewBox' | 'xmlns'>;

export default function QubeTXLogo({ size, className, color, ...props }: QubeTXLogoProps) {
  const uid = useId();
  const gradId = `crossGrad-${uid}`;
  const blue = color ?? 'white';
  const gradBlue = color ?? 'white';
  const purple = color ?? 'white';

  return (
    <svg
      viewBox="0 0 218 233"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeMiterlimit: 10 }}
      {...props}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradBlue} />
          <stop offset="100%" stopColor={purple} />
        </linearGradient>
      </defs>
      {/* Outer frame / left side */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M200.16,74.88C200.16,69.819 200.675,62.744 198.153,57.34C195.85,52.404 189.647,48.483 185.03,45.91L117.11,7.42C112.13,4.58 107.78,3.88 103.24,3.88C97.93,3.88 93.44,4.96 88.41,7.97L19.44,46.63C9.74,52.11 3.73,62.09 3.73,73.77L3.73,160.41C3.73,169.71 8.27,177.33 16.9,182.38L85.87,222.81C88.04,224.1 89.41,224.33 90.21,224.33C95.04,224.33 96.37,220.09 96.37,215.21L96.37,127.04C96.37,118.95 91.93,111.92 85.2,108.09L15.31,71.16C13.71,70.23 12.4,69.81 10.93,69.81C6.9,69.81 3.73,72.91 3.73,75.53"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
      {/* Horizontal cross-section */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M7.74,57.34L90.037,104.396C93.637,106.566 99.828,109.035 103.898,108.715C108.128,108.385 113.927,105.341 117.687,103.031L197.73,57.89"
          style={{ fill: 'none', stroke: `url(#${gradId})`, strokeWidth: '2px' }}
        />
      </g>
      {/* Lower horizontal cross-section */}
      <g transform="matrix(1,0,0,1,7.913328,122.4974)">
        <path
          d="M72.49,92.84C72.49,92.84 85.289,100.652 90.48,103.01C93.315,104.298 98.397,106.629 102.305,106.687C106.214,106.745 110.712,105.057 113.93,103.36C118.779,100.802 132.73,91.64 132.73,91.64"
          style={{ fill: 'none', stroke: `url(#${gradId})`, strokeWidth: '2px' }}
        />
      </g>
      {/* Center vertical line */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M103.898,108.715L103.49,229.251"
          style={{ fill: 'none', stroke: `url(#${gradId})`, strokeWidth: '2px' }}
        />
      </g>
      {/* Right face outer */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M197.73,67.92C196.161,67.076 193.516,67.728 190.846,69.368L120.21,108.743C113.26,112.483 109.76,120.373 109.76,126.803L110.427,215.45C110.593,223.357 112.983,224.65 116.593,224.33C118.053,224.19 124.037,220.153 125.417,219.263L188.76,180.09C196.96,175.62 200.16,167.64 200.16,160.23L200.16,75.61C200.16,73.31 200.282,69.294 197.73,67.92Z"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
      {/* Right face inner panel */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M190.31,86.11C190.32,81.38 186.796,80.861 183.761,82.189C172.911,86.939 125.9,115.08 125.9,115.08C120.91,117.86 118.47,124.38 118.47,128.31L118.47,202.11C118.368,210.113 122.699,209.314 126.024,207.222C136.147,200.851 183.71,172.21 183.71,172.21C188.69,169.38 190.15,165.05 190.15,159.01L190.31,86.11Z"
          style={{ fill: 'none', stroke: purple, strokeWidth: '2px' }}
        />
      </g>
      {/* Right face inner detail */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M178.351,84.925L178.3,156.22C178.3,159.91 177.06,162.26 174.71,163.72L118.74,196.06"
          style={{ fill: 'none', stroke: purple, strokeWidth: '2px' }}
        />
      </g>
      {/* Right face connector */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M176.9,161.6L188.21,167.49"
          style={{ fill: 'none', stroke: purple, strokeWidth: '2px' }}
        />
      </g>
      {/* Tiny point */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M13.16,70.83L13.25,70.78"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
      {/* Left face inner panel */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M18.43,82.82C16.21,82.82 15.27,84.61 15.27,86.4L15.27,157.91C15.27,163.35 16.92,167.96 21.09,171.2L82.22,205.71C85.33,207.55 87.39,205.08 87.39,202.2L87.39,129.08C87.39,123.64 84.11,118.25 79.62,115.8L20.51,82.96C19.66,82.59 18.96,82.82 18.43,82.82Z"
          style={{ fill: 'none', stroke: gradBlue, strokeWidth: '2px' }}
        />
      </g>
      {/* Left face inner detail */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M27.24,86.26L27.24,156.12C27.24,159.41 28.52,162.29 31.63,163.99L87.39,196.49"
          style={{ fill: 'none', stroke: gradBlue, strokeWidth: '2px' }}
        />
      </g>
      {/* Left face connector */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M27.69,161.1L17.38,167.05"
          style={{ fill: 'none', stroke: gradBlue, strokeWidth: '2px' }}
        />
      </g>
      {/* Top face outer */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M22.82,48.98L90.298,11.039C94.878,8.299 98.598,7.649 103.178,7.649C107.798,7.649 111.608,8.679 116.008,11.289L180.353,47.953C185.023,50.683 185.153,55.983 180.483,58.663L112.61,98.23C109.01,100.4 105.72,100.82 102.48,100.63C98.71,100.4 95.65,99.23 92.13,97.11L23.62,58.38C19.13,55.82 18.72,50.95 22.82,48.98Z"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
      {/* Top face inner */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M37.41,50.11L95.06,15.42C97.73,13.82 100.21,13.59 102.88,13.72C105.87,13.86 108.14,14.61 110.81,16.26L167.91,49.52C171.63,51.78 170.78,56.35 167.72,57.71L108.91,91.11C106.38,92.57 104.31,92.76 102.19,92.62C99.66,92.48 97.64,91.55 95.24,90.13L37.82,57.24C34.48,55.28 34.34,51.68 37.41,50.11Z"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
      {/* Top face cross line */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M42.77,59.85L98.12,26.5C101.02,24.76 105.19,25.03 107.91,26.82L163.587,60.014"
          style={{ fill: 'none', stroke: `url(#${gradId})`, strokeWidth: '2px' }}
        />
      </g>
      {/* Top vertical detail */}
      <g transform="matrix(1,0,0,1,7.033328,-0.065735)">
        <path
          d="M103.1,13.72L103.1,24.71"
          style={{ fill: 'none', stroke: blue, strokeWidth: '2px' }}
        />
      </g>
    </svg>
  );
}
