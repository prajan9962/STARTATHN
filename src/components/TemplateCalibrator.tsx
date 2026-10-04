import React, { useState } from 'react';
import { OverlayCoordinates, CertificateData } from '../types/certificate';
import { getOverlayCoordinates, saveOverlayCoordinates, resetOverlayCoordinates } from '../utils/overlayConfig';
import { CertificateCard } from './CertificateCard';
import { Sliders, RotateCcw, Check, Sparkles } from 'lucide-react';

export const TemplateCalibrator: React.FC = () => {
  const [coords, setCoords] = useState<OverlayCoordinates>(getOverlayCoordinates());
  const [savedMessage, setSavedMessage] = useState(false);

  // Mock certificate for live visual alignment
  const sampleCertificate: CertificateData = {
    certificateId: 'START26-0001',
    title: 'Mr.',
    fullName: 'Prajan L',
    department: 'Computer Science and Engineering',
    teamName: 'Innovators',
    email: 'participant@example.com',
    eventName: 'STARTATHON 2026',
    eventDate: '25 September 2026',
    issuedAt: new Date().toISOString(),
    status: 'issued',
    verificationUrl: 'https://startathon-2026.vercel.app/verify/START26-0001',
  };

  const handleUpdate = (updater: (prev: OverlayCoordinates) => OverlayCoordinates) => {
    setCoords((prev) => {
      const next = updater(prev);
      saveOverlayCoordinates(next);
      return next;
    });
  };

  const handleReset = () => {
    const defaultCoords = resetOverlayCoordinates();
    setCoords(defaultCoords);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleManualSave = () => {
    saveOverlayCoordinates(coords);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-200">
            <Sliders className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Certificate Overlay Calibrator</h3>
            <p className="text-xs text-slate-500">
              Micro-adjust overlay position percentages to match template blank lines precisely.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedMessage && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            Save Alignment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 text-xs">
          
          {/* 1. Name Position */}
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Participant Name (Y-axis)</span>
              <span className="font-mono text-blue-900">{coords.name.y.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              step="0.2"
              value={coords.name.y}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  name: { ...prev.name, y: parseFloat(e.target.value) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between font-bold text-slate-800 pt-1">
              <span>Name Font Size</span>
              <span className="font-mono text-blue-900">{coords.name.fontSize}px</span>
            </div>
            <input
              type="range"
              min="18"
              max="42"
              step="1"
              value={coords.name.fontSize}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  name: { ...prev.name, fontSize: parseInt(e.target.value, 10) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Department (Y-axis)</span>
              <span className="font-mono text-blue-900">{coords.department.y.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="75"
              step="0.2"
              value={coords.department.y}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  department: { ...prev.department, y: parseFloat(e.target.value) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between font-bold text-slate-800 pt-1">
              <span>Department Font Size</span>
              <span className="font-mono text-blue-900">{coords.department.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              step="1"
              value={coords.department.fontSize}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  department: { ...prev.department, fontSize: parseInt(e.target.value, 10) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Team Name (Y-axis)</span>
              <span className="font-mono text-blue-900">{coords.team.y.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="45"
              max="80"
              step="0.2"
              value={coords.team.y}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  team: { ...prev.team, y: parseFloat(e.target.value) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between font-bold text-slate-800 pt-1">
              <span>Team Font Size</span>
              <span className="font-mono text-blue-900">{coords.team.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              step="1"
              value={coords.team.fontSize}
              onChange={(e) =>
                handleUpdate((prev) => ({
                  ...prev,
                  team: { ...prev.team, fontSize: parseInt(e.target.value, 10) },
                }))
              }
              className="w-full accent-blue-900 cursor-pointer"
            />
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>QR Code (X / Y / Size)</span>
              <span className="font-mono text-blue-900">
                {coords.qrCode.x.toFixed(0)}%, {coords.qrCode.y.toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500">Horizontal (X)</span>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="0.5"
                  value={coords.qrCode.x}
                  onChange={(e) =>
                    handleUpdate((prev) => ({
                      ...prev,
                      qrCode: { ...prev.qrCode, x: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Vertical (Y)</span>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="0.5"
                  value={coords.qrCode.y}
                  onChange={(e) =>
                    handleUpdate((prev) => ({
                      ...prev,
                      qrCode: { ...prev.qrCode, y: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Visual Canvas Preview */}
        <div className="lg:col-span-7">
          <CertificateCard
            key={JSON.stringify(coords)}
            certificate={sampleCertificate}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
};
