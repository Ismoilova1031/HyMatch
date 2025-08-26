import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';
import { ProfileData } from '@/types/profile';

export const generateProfilePDF = async (profile: ProfileData) => {
  try {
    console.log('Starting PDF generation...');
    console.log('Profile data:', profile);
    
    // Convert images to base64 if they exist
    let profilePhotoBase64 = '';
    let visaPhotoBase64 = '';
    
    if (profile.profilePhoto) {
      console.log('Converting profile photo...');
      try {
        const response = await fetch(profile.profilePhoto);
        const blob = await response.blob();
        const reader = new FileReader();
        profilePhotoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        console.log('Profile photo converted successfully');
      } catch (error) {
        console.warn('Profile photo conversion failed:', error);
      }
    }
    
    if (profile.visaStatus.visaImage) {
      console.log('Converting visa photo...');
      try {
        const response = await fetch(profile.visaStatus.visaImage);
        const blob = await response.blob();
        const reader = new FileReader();
        visaPhotoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        console.log('Visa photo converted successfully');
      } catch (error) {
        console.warn('Visa photo conversion failed:', error);
      }
    }

    // HTML template for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>プロフィール情報</title>
          <style>
            body {
              font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f9efe7;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #007AFF;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #007AFF;
              font-size: 28px;
              margin: 0;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 15px;
              border-bottom: 2px solid #007AFF;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
              align-items: center;
            }
            .label {
              font-weight: bold;
              color: #555;
              min-width: 120px;
              margin-right: 15px;
            }
            .value {
              color: #333;
              flex: 1;
            }
            .profile-photo {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 3px solid #007AFF;
              object-fit: cover;
            }
            .visa-photo {
              width: 150px;
              height: 100px;
              border: 2px solid #ddd;
              object-fit: cover;
              border-radius: 5px;
            }
            .work-days {
              display: flex;
              gap: 5px;
              flex-wrap: wrap;
            }
            .work-day {
              background-color: #007AFF;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
            .empty-value {
              color: #999;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>プロフィール情報</h1>
              <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
            </div>

            <!-- 基本情報 -->
            <div class="section">
              <div class="section-title">基本情報</div>
                           <div class="info-row">
               <span class="label">氏名:</span>
               <span class="value">${profile.firstName} ${profile.lastName}</span>
             </div>
             ${profilePhotoBase64 ? `
             <div class="info-row">
               <span class="label">プロフィール写真:</span>
               <span class="value">
                 <img src="${profilePhotoBase64}" class="profile-photo" style="margin-left: 20px;">
               </span>
             </div>
             ` : ''}
              <div class="info-row">
                <span class="label">年齢:</span>
                <span class="value">${profile.age}歳</span>
              </div>
              <div class="info-row">
                <span class="label">国籍:</span>
                <span class="value">${profile.nationality || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">性別:</span>
                <span class="value">${profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : 'その他'}</span>
              </div>
            </div>

            <!-- 連絡先情報 -->
            <div class="section">
              <div class="section-title">連絡先情報</div>
              <div class="info-row">
                <span class="label">メールアドレス:</span>
                <span class="value">${profile.email || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">電話番号:</span>
                <span class="value">${profile.phoneNumber || '<span class="empty-value">未入力</span>'}</span>
              </div>
            </div>

            <!-- 住所情報 -->
            <div class="section">
              <div class="section-title">住所情報</div>
              <div class="info-row">
                <span class="label">郵便番号:</span>
                <span class="value">${profile.address.postalCode || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">都道府県:</span>
                <span class="value">${profile.address.prefecture || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">市区町村1:</span>
                <span class="value">${profile.address.city1 || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">市区町村2:</span>
                <span class="value">${profile.address.city2 || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">番地・建物名:</span>
                <span class="value">${profile.address.streetAddress || '<span class="empty-value">未入力</span>'}</span>
              </div>
            </div>

            <!-- 交通情報 -->
            <div class="section">
              <div class="section-title">交通情報</div>
              <div class="info-row">
                <span class="label">自宅最寄り駅:</span>
                <span class="value">${profile.homeStation.stationName || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">自宅駅徒歩時間:</span>
                <span class="value">${profile.homeStation.walkingMinutes ? `${profile.homeStation.walkingMinutes}分` : '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">学校最寄り駅:</span>
                <span class="value">${profile.schoolStation.stationName || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">学校駅徒歩時間:</span>
                <span class="value">${profile.schoolStation.walkingMinutes ? `${profile.schoolStation.walkingMinutes}分` : '<span class="empty-value">未入力</span>'}</span>
              </div>
            </div>

            <!-- ビザ情報 -->
            <div class="section">
              <div class="section-title">ビザ情報</div>
                           <div class="info-row">
               <span class="label">現在のビザ:</span>
               <span class="value">${profile.visaStatus.currentVisaType || '<span class="empty-value">未入力</span>'}</span>
             </div>
             ${visaPhotoBase64 ? `
             <div class="info-row">
               <span class="label">ビザ写真:</span>
               <span class="value">
                 <img src="${visaPhotoBase64}" class="visa-photo" style="margin-left: 20px;">
               </span>
             </div>
             ` : ''}
              <div class="info-row">
                <span class="label">日本語レベル:</span>
                <span class="value">${profile.japaneseLevel || '<span class="empty-value">未入力</span>'}</span>
              </div>
            </div>

            <!-- 仕事情報 -->
            <div class="section">
              <div class="section-title">仕事情報</div>
              <div class="info-row">
                <span class="label">現在の職業:</span>
                <span class="value">${profile.currentOccupation || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">希望職種:</span>
                <span class="value">${profile.desiredJobType || '<span class="empty-value">未入力</span>'}</span>
              </div>
              <div class="info-row">
                <span class="label">希望勤務日:</span>
                <span class="value">
                  ${profile.preferredWorkDays.length > 0 ? 
                    `<div class="work-days">${profile.preferredWorkDays.map(day => 
                      `<span class="work-day">${day}</span>`
                    ).join('')}</div>` : 
                    '<span class="empty-value">未選択</span>'
                  }
                </span>
              </div>
              <div class="info-row">
                <span class="label">職歴:</span>
                <span class="value">${profile.workHistory || '<span class="empty-value">未入力</span>'}</span>
              </div>
            </div>

            <div class="footer">
              <p>このプロフィールは HyMatch アプリで生成されました</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Generating PDF with HTML content...');
    
    // Generate PDF
    const result = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
      width: 612, // A4 width in points
      height: 792 // A4 height in points
    });

    console.log('PDF generation result:', result);
    console.log('PDF URI:', result.uri);

    return result.uri;
  } catch (error) {
    console.error('PDF generation error:', error);
    if (error instanceof Error) {
      throw new Error(`PDFの生成に失敗しました: ${error.message}`);
    } else {
      throw new Error('PDFの生成に失敗しました: 不明なエラー');
    }
  }
};

export const savePDFToDownloads = async (pdfUri: string, profileName: string) => {
  try {
    console.log('Starting PDF save to Downloads...');
    console.log('PDF URI:', pdfUri);
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `HyMatch_Profile_${profileName}_${timestamp}.pdf`;
    
    if (Platform.OS === 'android') {
      // Request permissions for Android
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('メディアライブラリへのアクセス許可が必要です');
      }

      try {
        // Try to save to MediaLibrary first
        const asset = await MediaLibrary.createAssetAsync(pdfUri);
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);
        console.log('PDF saved to MediaLibrary Downloads');
      } catch (mediaError) {
        console.warn('MediaLibrary save failed, using FileSystem fallback:', mediaError);
      }
      
      // Always save to app's documents directory as backup
      const documentsDir = FileSystem.documentDirectory;
      const backupPath = `${documentsDir}${filename}`;
      await FileSystem.copyAsync({
        from: pdfUri,
        to: backupPath
      });
      
      console.log('PDF saved to backup location:', backupPath);
      return { 
        success: true, 
        message: 'PDFが保存されました。ファイルマネージャーで確認できます。', 
        path: backupPath 
      };
      
    } else if (Platform.OS === 'ios') {
      // iOS: Save to app's documents directory
      const documentsDir = FileSystem.documentDirectory;
      const filePath = `${documentsDir}${filename}`;
      
      await FileSystem.copyAsync({
        from: pdfUri,
        to: filePath
      });
      
      console.log('PDF saved to Documents:', filePath);
      return { 
        success: true, 
        message: 'PDFが保存されました。Filesアプリで確認できます。', 
        path: filePath 
      };
    }
    
    throw new Error('サポートされていないプラットフォームです');
    
  } catch (error: any) {
    console.error('PDF save error:', error);
    throw error;
  }
};

export const sharePDF = async (pdfUri: string) => {
  try {
    console.log('Starting PDF sharing...');
    console.log('PDF URI:', pdfUri);
    
    const isAvailable = await Sharing.isAvailableAsync();
    console.log('Sharing available:', isAvailable);
    
    if (isAvailable) {
      console.log('Sharing PDF...');
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'プロフィールPDFを共有'
      });
      console.log('PDF shared successfully');
    } else {
      console.log('Sharing not available');
      throw new Error('共有機能が利用できません');
    }
  } catch (error) {
    console.error('PDF sharing error:', error);
    throw error;
  }
}; 