import { useEffect, useState } from 'react';
import SmokeMachine from './SmokeMachine';
import Image from 'next/image';
import initializeParallax from 'src/scripts/parallax';

export default function Parallax() {
  const [isCottageActive, setIsCottageActive] = useState(true);

  useEffect(() => {
    initializeParallax(document.querySelector('#__next'));
  }, []);

  return (
    <>
      <div
        className="parallax forest"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parallax="0.1"
        style={{
          backgroundImage: 'url("/forest.svg")',
          width: '150vw',
          height: '1500px',
          marginBottom: '-1500px',
          position: 'fixed',
        }}
      ></div>
      <div
        className="parallax"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parallax="0.25"
        style={{
          position: 'fixed',
        }}
      >
        <div className="forest-mask"></div>
        <div
          style={{
            position: 'absolute',
            left: '30px',
            top: '360px',
            opacity: 0.5,
          }}
        >
          {isCottageActive && <SmokeMachine />}
        </div>
        <div
          onClick={() => setIsCottageActive(true)}
          style={{
            position: 'absolute',
            left: '235px',
            top: '712px',
            width: '125px',
            height: '125px',
            zIndex: 999999,
            cursor: 'pointer',
          }}
        >
          {isCottageActive ? (
            <Image src="/cottage-light.png" width={300} height={300} />
          ) : (
            <Image src="/cottage.png" width={300} height={300} />
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '785px',
            width: '100vw',
            height: '750px',
            overflow: 'hidden',
          }}
        >
          <Image src="/hill.png" width={500} height={500} />
          <div
            style={{
              position: 'absolute',
              width: '950px',
              height: '800px',
              bottom: '-700px',
              left: '-70px',
              top: '350px',
              background:
                'linear-gradient(135deg, rgb(184, 185, 186) 40%, transparent 50%);',
              transform: 'rotate(45deg)',
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
