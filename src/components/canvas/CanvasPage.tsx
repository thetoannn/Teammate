import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CanvasExcali from './CanvasExcali';
import CanvasHeader from './CanvasHeader';
import CanvasMenu from './menu';
import CanvasPopbarWrapper from './pop-bar';
import ChatInterface from '../chat/Chat';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { CanvasProvider } from '../../contexts/canvas';
import { getCanvas, renameCanvas } from '../../api/canvas';
import { Session } from '../../types/types';
import { Loader2 } from 'lucide-react';

const CanvasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [canvas, setCanvas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [canvasName, setCanvasName] = useState('');
  const [sessionList, setSessionList] = useState<Session[]>([]);
  
  const searchParams = new URLSearchParams(window.location.search);
  const searchSessionId = searchParams.get('sessionId') || '';

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchCanvas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCanvas(id);
        if (mounted) {
          setCanvas(data);
          setCanvasName(data.name);
          setSessionList(data.sessions);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch canvas data'));
          console.error('Failed to fetch canvas data:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCanvas();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleNameSave = async () => {
    if (!id) return;
    await renameCanvas(id, canvasName);
  };

  if (!id) {
    return <div>Canvas ID not found</div>;
  }

  return (
    <CanvasProvider>
      <div className='flex flex-col w-screen h-screen'>
        <CanvasHeader
          canvasName={canvasName}
          canvasId={id}
          onNameChange={setCanvasName}
          onNameSave={handleNameSave}
        />
        <ResizablePanelGroup
          direction='horizontal'
          className='w-screen h-screen'
          autoSaveId='jaaz-chat-panel'
        >
          <ResizablePanel className='relative' defaultSize={75}>
            <div className='w-full h-full'>
              {isLoading ? (
                <div className='flex-1 flex-grow px-4 bg-accent w-[24%] absolute right-0'>
                  <div className='flex items-center justify-center h-full'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                  </div>
                </div>
              ) : (
                <div className='relative w-full h-full'>
                  <CanvasExcali canvasId={id} initialData={canvas?.data} />
                  <CanvasMenu />
                  <CanvasPopbarWrapper />
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={25}>
            <div className='flex-1 flex-grow bg-accent/50 w-full'>
              <ChatInterface
                canvasId={id}
                sessionList={sessionList}
                setSessionList={setSessionList}
                sessionId={searchSessionId}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </CanvasProvider>
  );
};

export default CanvasPage;
